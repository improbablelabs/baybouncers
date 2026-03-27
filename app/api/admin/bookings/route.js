import { adminDb } from "@/firebase/firebase-admin";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request) {
  const auth = request.headers.get("x-admin-password");
  if (auth !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const snap = await adminDb
      .collection("bookings")
      .orderBy("createdAt", "desc")
      .get();

    const bookings = snap.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        name: d.name,
        email: d.email,
        phone: d.phone,
        address: d.address,
        city: d.city,
        zip: d.zip,
        bouncerName: d.bouncerName,
        date: d.date,
        startTime: d.startTime,
        endTime: d.endTime,
        durationType: d.durationType,
        extraDays: d.extraDays,
        deliveryType: d.deliveryType,
        surface: d.surface,
        addOns: d.addOns,
        tableQty: d.tableQty,
        chairQty: d.chairQty,
        needsGenerator: d.needsGenerator,
        damageWaiver: d.damageWaiver,
        promoApplied: d.promoApplied,
        totalPrice: d.totalPrice,
        depositAmount: d.depositAmount,
        balanceDue: d.balanceDue,
        tipAmount: d.tipAmount,
        status: d.status,
        paymentStatus: d.paymentStatus,
        message: d.message,
        createdAt: d.createdAt?.toDate?.()?.toISOString() ?? null,
      };
    });

    return Response.json({ bookings });
  } catch (error) {
    console.error("Admin bookings error:", error);
    return Response.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
