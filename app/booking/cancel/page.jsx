// Booking Cancel Page
// Place at: app/booking/cancel/page.jsx
// Customer lands here if they cancel during Stripe Checkout

"use client";

import { useSearchParams } from "next/navigation";

export default function BookingCancel() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #FFFDF5, #FFF9E0)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=DM+Sans:wght@400;500;600;700;800&display=swap');
      `}</style>
      <div style={{ maxWidth: 480, textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>😕</div>

        <h1 style={{
          fontFamily: "'Lilita One', cursive", fontSize: 32,
          color: "#222", marginBottom: 12,
        }}>Payment Not Completed</h1>

        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 16,
          color: "#888", lineHeight: 1.6, marginBottom: 32,
        }}>
          No worries! Your reservation hasn't been charged. You can try again
          anytime or reach out to us if you'd like to pay with cash instead.
        </p>

        <div style={{
          background: "#FFFDF5", borderRadius: 12, padding: "16px 20px",
          border: "1px solid #FFE88D", marginBottom: 32,
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#666",
        }}>
          <p style={{ margin: 0 }}>
            Want to pay with cash? Just call us at <strong style={{ color: "#FF8C00" }}>(831) 332-9417</strong> and
            we'll reserve your bounce house over the phone!
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <a href="/#book"
            style={{
              background: "linear-gradient(135deg, #FFD700, #FFA500)",
              color: "#fff", textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16,
              padding: "14px 32px", borderRadius: 50, display: "inline-block",
            }}>Try Again</a>
          <a href="/"
            style={{
              background: "#f5f5f5", color: "#888", textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14,
              padding: "14px 24px", borderRadius: 50, display: "inline-block",
            }}>Back to Home</a>
        </div>
      </div>
    </div>
  );
}
