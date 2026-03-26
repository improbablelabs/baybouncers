// Booking Success Page
// Place at: app/booking/success/page.jsx
// Customer lands here after completing Stripe Checkout

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");
  const sessionId = searchParams.get("session_id");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      // Optionally fetch booking details to display
      // For now just show the confirmation
      setLoading(false);
    }
  }, [bookingId]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #FFFDF5, #FFF9E0)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes bayBounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-12px); }
        }
      `}</style>
      <div style={{ maxWidth: 520, textAlign: "center" }}>
        <div style={{
          fontSize: 80, marginBottom: 20,
          animation: "bayBounce 1s ease-in-out infinite alternate",
        }}>🎉</div>

        <h1 style={{
          fontFamily: "'Lilita One', cursive", fontSize: 36,
          color: "#222", marginBottom: 12,
        }}>You're All Set!</h1>

        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 17,
          color: "#888", lineHeight: 1.6, marginBottom: 32,
        }}>
          Your $60 deposit has been received and your bounce house is reserved!
          We'll send an email confirmation shortly, reach out by phone if you need help with your order.
        </p>

        <div style={{
          background: "#fff", borderRadius: 16, padding: 24,
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)", marginBottom: 24,
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#666",
        }}>
          <div style={{ fontSize: 13, color: "#999", marginBottom: 8 }}>Booking Reference</div>
          <div style={{
            fontSize: 18, fontWeight: 800, color: "#FF8C00",
            fontFamily: "monospace", letterSpacing: 1,
          }}>{bookingId || "..."}</div>
        </div>

        <div style={{
          background: "#FFFDF5", borderRadius: 12, padding: "16px 20px",
          border: "1px solid #FFE88D", marginBottom: 32,
          fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#666", lineHeight: 1.7,
          textAlign: "left",
        }}>
          <div style={{ fontWeight: 700, color: "#555", marginBottom: 6 }}>What happens next:</div>
          <div>• We'll confirm your booking via email within 24 hours</div>
          <div>• Our crew will deliver and set up on your event day</div>
          <div>• The remaining balance is due on delivery day</div>
          <div>• Your $60 deposit is non-refundable but stays as credit</div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <a href="/"
            style={{
              background: "linear-gradient(135deg, #FFD700, #FFA500)",
              color: "#fff", textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16,
              padding: "14px 32px", borderRadius: 50, display: "inline-block",
            }}>Back to Home</a>
          <a href="tel:+18313329417"
            style={{
              background: "#f5f5f5", color: "#888", textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14,
              padding: "14px 24px", borderRadius: 50, display: "inline-block",
            }}>📞 Call Us</a>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccess() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
