// API Route: POST /api/checkout
// Creates a Stripe Checkout Session for the $60 non-refundable deposit
// Place at: app/api/checkout/route.js

import Stripe from "stripe";
import { adminDb } from "@/firebase/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const MIN_GAP_HOURS = 3;
function toMinutes(t) { const [h, m] = t.split(":").map(Number); return h * 60 + m; }
function conflicts(existingStart, requestedStart) {
  if (!existingStart || !requestedStart) return true;
  return Math.abs(toMinutes(existingStart) - toMinutes(requestedStart)) < MIN_GAP_HOURS * 60;
}

// Bouncer data (keep in sync with frontend)
const BOUNCERS = [
  { id: 1, name: "The Block Party", price: 199 },
  { id: 2, name: "Jelly Bean Castle", price: 249 },
  { id: 3, name: "Ocean Wave Slide", price: 299 },
];

const ADD_ON_PRICES = {
  snowcone: 75,
  cottoncandy: 85,
  tables: 40,
  canopy: 60,
  jenga: 35,
  connect4: 35,
};

function calculateTotal(data, bouncer) {
  const rental = data.promoApplied ? 50 : bouncer.price;

  let durationFee = 0;
  if (data.durationType === "overnight") durationFee = 50;
  if (data.durationType === "multiday")
    durationFee = Math.round(bouncer.price * 0.5) * (data.extraDays || 1);

  const delivery = 60;
  const park = data.deliveryType === "park" ? 20 : 0;
  const generator = data.needsGenerator ? 120 : 0;

  let surfaceFee = 0;
  if (["Concrete", "Asphalt"].includes(data.surface)) surfaceFee = 12;
  if (["Dirt", "Bark"].includes(data.surface)) surfaceFee = 50;

  let addOnsTotal = 0;
  if (data.addOns && typeof data.addOns === "object") {
    for (const [id] of Object.entries(data.addOns)) {
      if (ADD_ON_PRICES[id]) addOnsTotal += ADD_ON_PRICES[id];
    }
  }

  const waiver = data.damageWaiver ? bouncer.price * 0.1 : 0;
  const tip = delivery * (data.tipPercent || 0) / 100;

  const total = rental + durationFee + delivery + park + generator + surfaceFee + addOnsTotal + waiver + tip;

  return {
    rentalPrice: rental,
    durationFee,
    deliveryFee: delivery,
    parkSurcharge: park,
    generatorFee: generator,
    surfaceFee,
    addOnsTotal,
    waiverFee: waiver,
    tipAmount: tip,
    totalPrice: total,
    depositAmount: 60,
    balanceDue: total - 60,
  };
}

export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    const required = [
      "name", "email", "phone", "address", "city", "zip",
      "surface", "deliveryType", "bouncerId", "date",
      "startTime", "endTime", "durationType",
    ];
    for (const field of required) {
      if (!data[field]) {
        return Response.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Validate bouncer
    const bouncer = BOUNCERS.find((b) => b.id === data.bouncerId);
    if (!bouncer) {
      return Response.json({ error: "Invalid bouncer selection" }, { status: 400 });
    }

    // Validate date
    const MIN_BOOKING_DAYS_AHEAD = 9; // change this to adjust minimum lead time
    const bookingDate = new Date(data.date + "T12:00:00");
    const minAllowed = new Date();
    minAllowed.setDate(minAllowed.getDate() + MIN_BOOKING_DAYS_AHEAD);
    minAllowed.setHours(0, 0, 0, 0);
    if (bookingDate < minAllowed) {
      return Response.json({ error: `Booking date must be at least ${MIN_BOOKING_DAYS_AHEAD} days in advance` }, { status: 400 });
    }

    // Check promo eligibility
    if (data.promoApplied) {
      const promoSnap = await adminDb
        .collection("bookings")
        .where("email", "==", data.email.toLowerCase())
        .where("promoApplied", "==", true)
        .get();
      if (!promoSnap.empty) {
        return Response.json({ error: "This email has already used the first-time promo" }, { status: 400 });
      }
    }

    // Check availability across all days
    const totalDays =
      data.durationType === "multiday"
        ? (data.extraDays || 1) + 1
        : data.durationType === "overnight"
        ? 2
        : 1;

    for (let d = 0; d < totalDays; d++) {
      const checkDate = new Date(data.date + "T12:00:00");
      checkDate.setDate(checkDate.getDate() + d);
      const dateStr = checkDate.toISOString().split("T")[0];

      const dayBookings = await adminDb
        .collection("bookings")
        .where("date", "==", dateStr)
        .where("bouncerId", "==", data.bouncerId)
        .get();

      const activeBookings = dayBookings.docs.filter(doc => {
        const { status, startTime: existingStart } = doc.data();
        if (status === "cancelled" || status === "expired") return false;
        return conflicts(existingStart, data.startTime);
      });

      if (activeBookings.length > 0) {
        return Response.json(
          { error: `${bouncer.name} is already booked on ${dateStr}` },
          { status: 409 }
        );
      }
    }

    // Calculate pricing server-side
    const pricing = calculateTotal(data, bouncer);

    // Create pending booking in Firestore
    const bookingDoc = await adminDb.collection("bookings").add({
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      message: data.message || "",
      address: data.address,
      city: data.city,
      zip: data.zip,
      deliveryType: data.deliveryType,
      surface: data.surface,
      bouncerId: data.bouncerId,
      bouncerName: bouncer.name,
      bouncerPrice: bouncer.price,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      durationType: data.durationType,
      extraDays: data.extraDays || 0,
      addOns: data.addOns || {},
      needsGenerator: data.needsGenerator || false,
      damageWaiver: data.damageWaiver || false,
      tipPercent: data.tipPercent || 0,
      ...pricing,
      promoApplied: data.promoApplied || false,
      status: "pending",
      paymentStatus: "deposit_pending",
      stripeSessionId: null,
      stripePaymentIntentId: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Build line items for Stripe Checkout
    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Reservation Deposit (Non-Refundable)",
            description: `${bouncer.name} on ${data.date} (${data.startTime} to ${data.endTime}). Deposit secures your booking and remains as credit if cancelled.`,
          },
          unit_amount: 6000, // $60.00 in cents
        },
        quantity: 1,
      },
    ];

    // If there's a tip, add it as a separate line item
    if (pricing.tipAmount > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Delivery Crew Tip",
            description: `${data.tipPercent}% tip for your delivery crew`,
          },
          unit_amount: Math.round(pricing.tipAmount * 100),
        },
        quantity: 1,
      });
    }

    // Create Stripe Checkout Session
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://baybouncers.com";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: data.email.toLowerCase(),
      line_items: lineItems,
      metadata: {
        bookingId: bookingDoc.id,
        bouncerName: bouncer.name,
        date: data.date,
        totalPrice: pricing.totalPrice.toFixed(2),
        balanceDue: pricing.balanceDue.toFixed(2),
      },
      success_url: `${baseUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingDoc.id}`,
      cancel_url: `${baseUrl}/booking/cancel?booking_id=${bookingDoc.id}`,
      expires_at: Math.floor(Date.now() / 1000) + 1800,
    });

    // Store Stripe session ID on the booking
    await adminDb.collection("bookings").doc(bookingDoc.id).update({
      stripeSessionId: session.id,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return Response.json({
      success: true,
      bookingId: bookingDoc.id,
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return Response.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
