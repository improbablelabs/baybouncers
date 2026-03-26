// Email Notifications for BayBouncers
// Uses Resend (add RESEND_API_KEY to Vercel env vars)
// npm install resend

// Optional: uncomment and configure if you want email notifications
// import { Resend } from "resend";
// const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send booking confirmation email to customer
 */
export async function sendBookingConfirmation(booking) {
  // Uncomment when ready to send emails:
  /*
  try {
    await resend.emails.send({
      from: "BayBouncers <bookings@baybouncers.com>",
      to: booking.email,
      subject: `Booking Confirmed! ${booking.bouncerName} on ${booking.date}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #FFD700, #FFA500); padding: 32px; text-align: center; border-radius: 16px 16px 0 0;">
            <h1 style="color: #fff; margin: 0; font-size: 28px;">🎪 BayBouncers</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">Booking Confirmation</p>
          </div>
          <div style="background: #fff; padding: 32px; border: 1px solid #eee; border-radius: 0 0 16px 16px;">
            <p>Hi ${booking.name},</p>
            <p>We've received your booking request! Here are the details:</p>
            
            <div style="background: #FFFDF5; border: 1px solid #FFE88D; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0 0 8px;"><strong>${booking.bouncerName}</strong></p>
              <p style="margin: 0 0 4px; color: #666;">📅 ${booking.date}</p>
              <p style="margin: 0 0 4px; color: #666;">⏰ ${booking.startTime} to ${booking.endTime}</p>
              <p style="margin: 0 0 4px; color: #666;">📍 ${booking.address}, ${booking.city} ${booking.zip}</p>
              <p style="margin: 0 0 4px; color: #666;">🚚 ${booking.deliveryType === "park" ? "Park Delivery" : "Home Delivery"}</p>
              <hr style="border: none; border-top: 1px solid #FFE88D; margin: 16px 0;" />
              <p style="margin: 0; font-size: 18px;"><strong style="color: #FF8C00;">Total: $${booking.totalPrice.toFixed(2)}</strong></p>
              <p style="margin: 4px 0 0; color: #888; font-size: 13px;">Deposit paid: $60.00 | Balance due on delivery: $${booking.balanceDue.toFixed(2)}</p>
            </div>

            <p>We'll reach out within 24 hours to confirm everything. If you have any questions, call us at <strong>(831) 555-JUMP</strong>.</p>
            
            <p>Thanks for choosing BayBouncers! 🎉</p>
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: error.message };
  }
  */
  console.log("Email notification skipped (not configured):", booking.email);
  return { success: true };
}

/**
 * Send new booking alert to BayBouncers team
 */
export async function sendAdminAlert(booking) {
  // Uncomment when ready:
  /*
  try {
    await resend.emails.send({
      from: "BayBouncers System <system@baybouncers.com>",
      to: "hello@baybouncers.com",
      subject: `🎪 New Booking! ${booking.bouncerName} - ${booking.date}`,
      html: `
        <div style="font-family: sans-serif;">
          <h2>New Booking Request</h2>
          <p><strong>Customer:</strong> ${booking.name} (${booking.phone})</p>
          <p><strong>Email:</strong> ${booking.email}</p>
          <p><strong>Bouncer:</strong> ${booking.bouncerName}</p>
          <p><strong>Date:</strong> ${booking.date} | ${booking.startTime} - ${booking.endTime}</p>
          <p><strong>Duration:</strong> ${booking.durationType}${booking.extraDays > 0 ? ` (+${booking.extraDays} days)` : ""}</p>
          <p><strong>Delivery:</strong> ${booking.deliveryType} to ${booking.address}, ${booking.city} ${booking.zip}</p>
          <p><strong>Surface:</strong> ${booking.surface}</p>
          <p><strong>Generator:</strong> ${booking.needsGenerator ? "Yes" : "No"}</p>
          <p><strong>Damage Waiver:</strong> ${booking.damageWaiver ? "Yes" : "No"}</p>
          <p><strong>Add-ons:</strong> ${Object.keys(booking.addOns || {}).join(", ") || "None"}</p>
          <p><strong>Promo:</strong> ${booking.promoApplied ? "Yes ($50 deal)" : "No"}</p>
          <hr />
          <p><strong>Total:</strong> $${booking.totalPrice.toFixed(2)}</p>
          <p><strong>Deposit:</strong> $60.00 | <strong>Balance:</strong> $${booking.balanceDue.toFixed(2)}</p>
          ${booking.message ? `<p><strong>Notes:</strong> ${booking.message}</p>` : ""}
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Admin alert error:", error);
    return { success: false, error: error.message };
  }
  */
  console.log("Admin alert skipped (not configured)");
  return { success: true };
}
