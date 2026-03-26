import { adminDb } from "@/firebase/firebase-admin";

const TOTAL_TABLES = 10;
const TOTAL_CHAIRS = 50;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const durationType = searchParams.get("durationType") || "sameday";
  const extraDays = parseInt(searchParams.get("extraDays") || "1");

  if (!date) return Response.json({ error: "date required" }, { status: 400 });

  const totalDays =
    durationType === "multiday" ? extraDays + 1 :
    durationType === "overnight" ? 2 : 1;

  let minAvailableTables = TOTAL_TABLES;
  let minAvailableChairs = TOTAL_CHAIRS;

  for (let d = 0; d < totalDays; d++) {
    const checkDate = new Date(date + "T12:00:00");
    checkDate.setDate(checkDate.getDate() + d);
    const dateStr = checkDate.toISOString().split("T")[0];

    const snap = await adminDb
      .collection("bookings")
      .where("date", "==", dateStr)
      .where("status", "not-in", ["cancelled", "expired"])
      .get();

    let dayTables = 0;
    let dayChairs = 0;
    snap.forEach(doc => {
      const b = doc.data();
      dayTables += b.tableQty || 0;
      dayChairs += b.chairQty || 0;
    });

    minAvailableTables = Math.min(minAvailableTables, TOTAL_TABLES - dayTables);
    minAvailableChairs = Math.min(minAvailableChairs, TOTAL_CHAIRS - dayChairs);
  }

  return Response.json({
    availableTables: Math.max(0, minAvailableTables),
    availableChairs: Math.max(0, minAvailableChairs),
    totalTables: TOTAL_TABLES,
    totalChairs: TOTAL_CHAIRS,
  });
}
