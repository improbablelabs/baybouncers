// API Route: POST /api/bookings
// Server-side booking creation with validation
// Place this at: app/api/bookings/route.js (App Router)
// or: pages/api/bookings.js (Pages Router)

import { adminDb } from "@/firebase/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// All bouncer data (keep in sync with frontend)
const BOUNCERS = [
  { id: 1, name: "The Block Party", price: 199 },
  { id: 2, name: "Jelly Bean Castle", price: 249 },
  { id: 3, name: "Ocean Wave Slide", price: 299 },
];

const ADD_ON_PRICES = {
  snowcone: 75,
  cottoncandy: 85,
  canopy: 60,
  jenga: 35,
  connect4: 35,
};
const TABLE_UNIT_PRICE = 20;
const CHAIR_UNIT_PRICE = 5;
const TOTAL_TABLES = 2;
const TOTAL_CHAIRS = 12;

// Recalculate total server-side to prevent price tampering
function calculateTotal(data, bouncer) {
  const rental = data.promoApplied ? 50 : bouncer.price;

  let durationFee = 0;
  if (data.durationType === "overnight") durationFee = 50;
  if (data.durationType === "multiday") durationFee = Math.round(bouncer.price * 0.5) * (data.extraDays || 1);

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
  if (data.addOns?.table) addOnsTotal += (data.tableQty || 0) * TABLE_UNIT_PRICE;
  if (data.addOns?.chair) addOnsTotal += (data.chairQty || 0) * CHAIR_UNIT_PRICE;

  const waiver = data.damageWaiver ? bouncer.price * 0.10 : 0;
  const tip = delivery * (data.tipPercent || 0) / 100;

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
    totalPrice: rental + durationFee + delivery + park + generator + surfaceFee + addOnsTotal + waiver + tip,
    depositAmount: 60,
    balanceDue: rental + durationFee + delivery + park + generator + surfaceFee + addOnsTotal + waiver + tip - 60,
  };
}

// App Router handler
export async function POST(request) {
  try {
    const data = await request.json();

    // ── Validate required fields ──
    const required = ["name", "email", "phone", "address", "city", "zip", "surface", "deliveryType", "bouncerId", "date", "startTime", "endTime", "durationType"];
    for (const field of required) {
      if (!data[field]) {
        return Response.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // ── Validate bouncer exists ──
    const bouncer = BOUNCERS.find((b) => b.id === data.bouncerId);
    if (!bouncer) {
      return Response.json({ error: "Invalid bouncer selection" }, { status: 400 });
    }

    // ── Validate date is in the future ──
    const MIN_BOOKING_DAYS_AHEAD = 9; // change this to adjust minimum lead time
    const bookingDate = new Date(data.date + "T12:00:00");
    const minAllowed = new Date();
    minAllowed.setDate(minAllowed.getDate() + MIN_BOOKING_DAYS_AHEAD);
    minAllowed.setHours(0, 0, 0, 0);
    if (bookingDate < minAllowed) {
      return Response.json({ error: `Booking date must be at least ${MIN_BOOKING_DAYS_AHEAD} days in advance` }, { status: 400 });
    }

    // ── Check promo eligibility ──
    if (data.promoApplied) {
      const promoQuery = await adminDb
        .collection("bookings")
        .where("email", "==", data.email.toLowerCase())
        .where("promoApplied", "==", true)
        .get();

      if (!promoQuery.empty) {
        return Response.json({ error: "This email has already used the first-time promo" }, { status: 400 });
      }
    }

    // ── Check availability ──
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
        .where("status", "not-in", ["cancelled", "expired"])
        .get();

      if (!dayBookings.empty) {
        return Response.json(
          { error: `${bouncer.name} is already booked on ${dateStr}` },
          { status: 409 }
        );
      }
    }

    // Check table/chair inventory
    if (data.tableQty || data.chairQty) {
      for (let d = 0; d < totalDays; d++) {
        const checkDate = new Date(data.date + "T12:00:00");
        checkDate.setDate(checkDate.getDate() + d);
        const dateStr = checkDate.toISOString().split("T")[0];

        const daySnap = await adminDb
          .collection("bookings")
          .where("date", "==", dateStr)
          .where("status", "in", ["pending", "confirmed"])
          .get();

        let dayTables = 0;
        let dayChairs = 0;
        daySnap.forEach(doc => {
          dayTables += doc.data().tableQty || 0;
          dayChairs += doc.data().chairQty || 0;
        });

        if (data.tableQty && dayTables + data.tableQty > TOTAL_TABLES) {
          return Response.json({ error: `Only ${TOTAL_TABLES - dayTables} tables available on ${dateStr}` }, { status: 409 });
        }
        if (data.chairQty && dayChairs + data.chairQty > TOTAL_CHAIRS) {
          return Response.json({ error: `Only ${TOTAL_CHAIRS - dayChairs} chairs available on ${dateStr}` }, { status: 409 });
        }
      }
    }

    // ── Calculate pricing server-side ──
    const pricing = calculateTotal(data, bouncer);

    // ── Create booking ──
    const bookingDoc = await adminDb.collection("bookings").add({
      // Customer
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      message: data.message || "",

      // Location
      address: data.address,
      city: data.city,
      zip: data.zip,
      deliveryType: data.deliveryType,
      surface: data.surface,

      // Bouncer
      bouncerId: data.bouncerId,
      bouncerName: bouncer.name,
      bouncerPrice: bouncer.price,

      // Timing
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      durationType: data.durationType,
      extraDays: data.extraDays || 0,

      // Extras
      addOns: data.addOns || {},
      tableQty: data.tableQty || 0,
      chairQty: data.chairQty || 0,
      needsGenerator: data.needsGenerator || false,
      damageWaiver: data.damageWaiver || false,
      tipPercent: data.tipPercent || 0,

      // Pricing (server-calculated)
      ...pricing,

      // Promo
      promoApplied: data.promoApplied || false,

      // Status
      status: "pending",
      paymentStatus: "deposit_pending",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return Response.json({
      success: true,
      bookingId: bookingDoc.id,
      pricing,
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    return Response.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
