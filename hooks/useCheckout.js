// useCheckout Hook — Stripe Integration for Booking Wizard
// Place at: hooks/useCheckout.js
//
// Usage in BookingWizard:
//
//   import { useCheckout } from "@/hooks/useCheckout";
//
//   function BookingWizard({ promoActive }) {
//     const { checkout, submitting, error } = useCheckout();
//     ...
//     const handleSubmit = async () => {
//       const result = await checkout({
//         ...form,
//         bouncerId: selectedBouncer.id,
//         bouncerName: selectedBouncer.name,
//         bouncerPrice: selectedBouncer.price,
//         date: selectedDate,
//         startTime: timing.startTime,
//         endTime: timing.endTime,
//         durationType: timing.durationType,
//         extraDays: timing.extraDays,
//         promoApplied: promoActive,
//       });
//       // If checkout returns a URL, redirect to Stripe
//       // If it fails, error state is set automatically
//     };
//     ...
//   }

import { useState } from "react";

export function useCheckout() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const checkout = async (bookingData) => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return { success: false, error: result.error };
      }

      // Redirect to Stripe Checkout
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        // Don't set submitting to false — page is redirecting
        return { success: true, redirecting: true };
      }

      setSubmitting(false);
      return { success: false, error: "No checkout URL received" };
    } catch (err) {
      const message = "Network error. Please check your connection and try again.";
      setError(message);
      setSubmitting(false);
      return { success: false, error: message };
    }
  };

  // Alternative: pay with cash (creates booking without Stripe)
  const bookWithCash = async (bookingData) => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return { success: false, error: result.error };
      }

      setSubmitting(false);
      return { success: true, bookingId: result.bookingId };
    } catch (err) {
      const message = "Network error. Please check your connection and try again.";
      setError(message);
      setSubmitting(false);
      return { success: false, error: message };
    }
  };

  return { checkout, bookWithCash, submitting, error, setError };
}
