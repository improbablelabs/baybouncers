// Firestore Helper Functions for BayBouncers
// Handles booking CRUD, availability checking, and promo validation

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ─────────────────────────────────────────────
// BOOKINGS
// ─────────────────────────────────────────────

/**
 * Create a new booking request
 * Status flow: pending → confirmed → completed / cancelled
 */
export async function createBooking(bookingData) {
  try {
    const docRef = await addDoc(collection(db, "bookings"), {
      // Customer info
      name: bookingData.name,
      email: bookingData.email,
      phone: bookingData.phone,
      message: bookingData.message || "",

      // Delivery info
      address: bookingData.address,
      city: bookingData.city,
      zip: bookingData.zip,
      deliveryType: bookingData.deliveryType, // "home" | "park"
      surface: bookingData.surface,

      // Bouncer selection
      bouncerId: bookingData.bouncerId,
      bouncerName: bookingData.bouncerName,
      bouncerPrice: bookingData.bouncerPrice,

      // Timing
      date: bookingData.date,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
      durationType: bookingData.durationType, // "sameday" | "overnight" | "multiday"
      extraDays: bookingData.extraDays || 0,

      // Add-ons & extras
      addOns: bookingData.addOns || {},
      needsGenerator: bookingData.needsGenerator || false,
      damageWaiver: bookingData.damageWaiver || false,
      tipPercent: bookingData.tipPercent || 0,

      // Pricing (store calculated values for record)
      rentalPrice: bookingData.rentalPrice,
      deliveryFee: 60,
      parkSurcharge: bookingData.deliveryType === "park" ? 20 : 0,
      generatorFee: bookingData.needsGenerator ? 120 : 0,
      surfaceFee: bookingData.surfaceFee || 0,
      addOnsTotal: bookingData.addOnsTotal || 0,
      durationFee: bookingData.durationFee || 0,
      waiverFee: bookingData.waiverFee || 0,
      tipAmount: bookingData.tipAmount || 0,
      totalPrice: bookingData.totalPrice,
      depositAmount: 60,
      balanceDue: bookingData.totalPrice - 60,

      // Promo
      promoApplied: bookingData.promoApplied || false,

      // Status & timestamps
      status: "pending",
      paymentStatus: "deposit_pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get a single booking by ID
 */
export async function getBooking(bookingId) {
  try {
    const docSnap = await getDoc(doc(db, "bookings", bookingId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting booking:", error);
    return null;
  }
}

/**
 * Update booking status
 */
export async function updateBookingStatus(bookingId, status, paymentStatus) {
  try {
    await updateDoc(doc(db, "bookings", bookingId), {
      status,
      ...(paymentStatus && { paymentStatus }),
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating booking:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Cancel a booking
 */
export async function cancelBooking(bookingId) {
  return updateBookingStatus(bookingId, "cancelled", "deposit_credited");
}

/**
 * Get all bookings (admin)
 */
export async function getAllBookings(statusFilter) {
  try {
    let q;
    if (statusFilter) {
      q = query(
        collection(db, "bookings"),
        where("status", "==", statusFilter),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error getting bookings:", error);
    return [];
  }
}

// ─────────────────────────────────────────────
// AVAILABILITY
// ─────────────────────────────────────────────

/**
 * Get booked bouncer IDs for a specific date
 * Returns array of bouncer IDs that are already booked
 */
export async function getBookedBouncerIds(dateStr) {
  try {
    const q = query(
      collection(db, "bookings"),
      where("date", "==", dateStr),
      where("status", "not-in", ["cancelled", "expired"])
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => d.data().bouncerId);
  } catch (error) {
    console.error("Error checking availability:", error);
    return [];
  }
}

/**
 * Check availability across multiple dates (for multi-day / overnight)
 * Returns bouncer IDs that are booked on ANY of the given dates
 */
export async function getBookedBouncerIdsForRange(startDate, totalDays) {
  const bookedIds = new Set();
  for (let d = 0; d < totalDays; d++) {
    const date = new Date(startDate + "T12:00:00");
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split("T")[0];
    const dayBooked = await getBookedBouncerIds(dateStr);
    dayBooked.forEach((id) => bookedIds.add(id));
  }
  return [...bookedIds];
}

/**
 * Get available bouncers for a date range
 * Pass in your full BOUNCERS array and the date info
 */
export async function getAvailableBouncersFromDB(allBouncers, startDate, durationType, extraDays) {
  const totalDays =
    durationType === "multiday"
      ? extraDays + 1
      : durationType === "overnight"
      ? 2
      : 1;

  const bookedIds = await getBookedBouncerIdsForRange(startDate, totalDays);
  return allBouncers.filter((b) => !bookedIds.includes(b.id));
}

// ─────────────────────────────────────────────
// PROMO VALIDATION
// ─────────────────────────────────────────────

/**
 * Check if an email/phone has already used the first-time promo
 */
export async function hasUsedPromo(email, phone) {
  try {
    // Check by email
    const emailQuery = query(
      collection(db, "bookings"),
      where("email", "==", email.toLowerCase()),
      where("promoApplied", "==", true)
    );
    const emailSnap = await getDocs(emailQuery);
    if (!emailSnap.empty) return true;

    // Check by phone
    const phoneQuery = query(
      collection(db, "bookings"),
      where("phone", "==", phone),
      where("promoApplied", "==", true)
    );
    const phoneSnap = await getDocs(phoneQuery);
    return !phoneSnap.empty;
  } catch (error) {
    console.error("Error checking promo usage:", error);
    return false; // Allow promo on error, validate server-side
  }
}

// ─────────────────────────────────────────────
// BLOCKED DATES (optional: admin can block dates)
// ─────────────────────────────────────────────

/**
 * Check if a date is blocked by admin
 */
export async function isDateBlocked(dateStr) {
  try {
    const docSnap = await getDoc(doc(db, "blockedDates", dateStr));
    return docSnap.exists();
  } catch (error) {
    return false;
  }
}

/**
 * Block a date (admin)
 */
export async function blockDate(dateStr, reason) {
  try {
    const { setDoc } = await import("firebase/firestore");
    await setDoc(doc(db, "blockedDates", dateStr), {
      reason: reason || "Blocked",
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Unblock a date (admin)
 */
export async function unblockDate(dateStr) {
  try {
    await deleteDoc(doc(db, "blockedDates", dateStr));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
