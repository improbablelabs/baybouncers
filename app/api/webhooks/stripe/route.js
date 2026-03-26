// API Route: POST /api/webhooks/stripe
// Handles Stripe webhook events to update booking status
// Place at: app/api/webhooks/stripe/route.js
//
// IMPORTANT: Configure this webhook URL in Stripe Dashboard:
// https://dashboard.stripe.com/webhooks
// → Add endpoint: https://baybouncers.com/api/webhooks/stripe
// → Listen for: checkout.session.completed, checkout.session.expired

import Stripe from "stripe";
import { adminDb } from "@/firebase/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
// Uncomment when email is configured:
// import { sendBookingConfirmation, sendAdminAlert } from "@/firebase/email-notifications";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return Response.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle events
    switch (event.type) {
      // ── Payment successful ──
      case "checkout.session.completed": {
        const session = event.data.object;
        const bookingId = session.metadata?.bookingId;

        if (!bookingId) {
          console.error("No bookingId in session metadata");
          break;
        }

        // Update booking status
        await adminDb.collection("bookings").doc(bookingId).update({
          status: "confirmed",
          paymentStatus: "deposit_paid",
          stripePaymentIntentId: session.payment_intent,
          stripeCustomerId: session.customer || null,
          depositPaidAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });

        console.log(`Booking ${bookingId} confirmed — deposit paid`);

        // Send confirmation emails
        // Uncomment when email is configured:
        /*
        const bookingSnap = await adminDb.collection("bookings").doc(bookingId).get();
        if (bookingSnap.exists) {
          const booking = { id: bookingSnap.id, ...bookingSnap.data() };
          await sendBookingConfirmation(booking);
          await sendAdminAlert(booking);
        }
        */

        break;
      }

      // ── Checkout session expired (customer didn't pay in 30 min) ──
      case "checkout.session.expired": {
        const session = event.data.object;
        const bookingId = session.metadata?.bookingId;

        if (bookingId) {
          await adminDb.collection("bookings").doc(bookingId).update({
            status: "expired",
            paymentStatus: "deposit_expired",
            updatedAt: FieldValue.serverTimestamp(),
          });
          console.log(`Booking ${bookingId} expired — payment not completed`);
        }

        break;
      }

      // ── Refund issued ──
      case "charge.refunded": {
        const charge = event.data.object;
        // Find booking by payment intent
        const bookingsSnap = await adminDb
          .collection("bookings")
          .where("stripePaymentIntentId", "==", charge.payment_intent)
          .get();

        if (!bookingsSnap.empty) {
          const bookingDoc = bookingsSnap.docs[0];
          await bookingDoc.ref.update({
            status: "cancelled",
            paymentStatus: "refunded",
            updatedAt: FieldValue.serverTimestamp(),
          });
          console.log(`Booking ${bookingDoc.id} refunded`);
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

// Stripe webhooks need the raw body, so disable body parsing
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
