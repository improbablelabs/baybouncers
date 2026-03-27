import { adminDb } from "@/firebase/firebase-admin";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BOUNCERS = [
  { id: 1, name: "The Block Party", price: 199 },
  { id: 2, name: "Jelly Bean Castle", price: 249 },
  { id: 3, name: "Ocean Wave Slide", price: 299 },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const durationType = searchParams.get("durationType") || "sameday";
  const extraDays = parseInt(searchParams.get("extraDays") || "1");

  if (!date) return Response.json({ error: "date required" }, { status: 400 });

  const totalDays =
    durationType === "multiday" ? extraDays + 1 :
    durationType === "overnight" ? 2 : 1;

  const bookedIds = new Set();

  for (let d = 0; d < totalDays; d++) {
    const checkDate = new Date(date + "T12:00:00");
    checkDate.setDate(checkDate.getDate() + d);
    const dateStr = checkDate.toISOString().split("T")[0];

    const snap = await adminDb
      .collection("bookings")
      .where("date", "==", dateStr)
      .where("status", "not-in", ["cancelled", "expired"])
      .get();

    snap.forEach(doc => bookedIds.add(doc.data().bouncerId));
  }

  const available = BOUNCERS.filter(b => !bookedIds.has(b.id));

  return Response.json({ available });
}
