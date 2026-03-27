"use client";

import { useState } from "react";

const STATUS_COLORS = {
  pending:   { bg: "#FFF8E1", color: "#B8860B", label: "Pending" },
  confirmed: { bg: "#E8F5E9", color: "#2E7D32", label: "Confirmed" },
  cancelled: { bg: "#FFEBEE", color: "#C62828", label: "Cancelled" },
  expired:   { bg: "#F5F5F5", color: "#9E9E9E", label: "Expired" },
};

const PAYMENT_COLORS = {
  deposit_pending: { bg: "#FFF3E0", color: "#E65100", label: "Deposit Pending" },
  deposit_paid:    { bg: "#E3F2FD", color: "#1565C0", label: "Deposit Paid" },
  paid_in_full:    { bg: "#E8F5E9", color: "#2E7D32", label: "Paid in Full" },
  refunded:        { bg: "#F3E5F5", color: "#6A1B9A", label: "Refunded" },
};

function Badge({ map, value }) {
  const cfg = map[value] ?? { bg: "#F5F5F5", color: "#555", label: value };
  return (
    <span style={{
      background: cfg.bg, color: cfg.color,
      fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
      padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap",
    }}>{cfg.label}</span>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-");
  return new Date(+y, +m - 1, +d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(t) {
  if (!t) return "";
  const [h, min] = t.split(":");
  const hour = +h;
  return `${hour % 12 || 12}:${min} ${hour < 12 ? "AM" : "PM"}`;
}

function AddOnList({ addOns, tableQty, chairQty }) {
  const names = {
    snowcone: "Snow Cone Machine",
    cottoncandy: "Cotton Candy Machine",
    canopy: "Canopy / Tent",
    jenga: "Giant Jenga",
    connect4: "Giant Connect 4",
  };
  const items = [];
  if (addOns) {
    for (const key of Object.keys(addOns)) {
      if (key === "table") items.push(`Tables ×${tableQty}`);
      else if (key === "chair") items.push(`Chairs ×${chairQty}`);
      else if (names[key]) items.push(names[key]);
    }
  }
  return items.length ? <span>{items.join(", ")}</span> : <span style={{ color: "#bbb" }}>None</span>;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/bookings", {
        headers: { "x-admin-password": password },
      });
      if (!res.ok) { setError("Incorrect password."); setLoading(false); return; }
      const data = await res.json();
      setBookings(data.bookings);
      setAuthed(true);
    } catch {
      setError("Failed to connect.");
    }
    setLoading(false);
  }

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bookings", {
        headers: { "x-admin-password": password },
      });
      const data = await res.json();
      setBookings(data.bookings);
    } catch {}
    setLoading(false);
  }

  const filtered = bookings.filter((b) => {
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || b.name?.toLowerCase().includes(q) || b.email?.toLowerCase().includes(q) || b.date?.includes(q) || b.bouncerName?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  if (!authed) {
    return (
      <div style={{
        minHeight: "100vh", background: "linear-gradient(180deg, #FFFDF5, #FFF9E0)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>
        <div style={{ background: "#fff", borderRadius: 20, padding: 40, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", width: "100%", maxWidth: 380 }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <img src="/icon.png" alt="logo" style={{ width: 52, height: 52, objectFit: "contain", marginBottom: 12 }} />
            <h1 style={{ fontFamily: "'Lilita One', cursive", fontSize: 26, color: "#222", margin: 0 }}>Admin Dashboard</h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#888", fontSize: 14, marginTop: 6 }}>Enter your password to continue</p>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              style={{
                width: "100%", boxSizing: "border-box", padding: "13px 16px",
                border: "2px solid #eee", borderRadius: 12, fontSize: 16,
                fontFamily: "'DM Sans', sans-serif", marginBottom: 16, outline: "none",
              }}
            />
            {error && <p style={{ color: "#C62828", fontFamily: "'DM Sans', sans-serif", fontSize: 13, marginBottom: 12 }}>{error}</p>}
            <button type="submit" disabled={loading} style={{
              width: "100%", background: "linear-gradient(135deg, #FFD700, #FFA500)",
              color: "#fff", border: "none", borderRadius: 50, padding: "14px 0",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16, cursor: "pointer",
            }}>
              {loading ? "Checking…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F9F9F9", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/icon.png" alt="logo" style={{ width: 36, height: 36, objectFit: "contain" }} />
          <span style={{ fontFamily: "'Lilita One', cursive", fontSize: 22, color: "#222" }}>BayBouncers Admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "#888", fontSize: 14 }}>{bookings.length} reservation{bookings.length !== 1 ? "s" : ""}</span>
          <button onClick={refresh} disabled={loading} style={{
            background: "linear-gradient(135deg, #FFD700, #FFA500)", color: "#fff",
            border: "none", borderRadius: 50, padding: "8px 20px",
            fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}>
            {loading ? "…" : "Refresh"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ padding: "20px 28px", display: "flex", gap: 12, flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name, email, date…"
          style={{
            flex: "1 1 220px", padding: "10px 16px", border: "2px solid #eee",
            borderRadius: 50, fontSize: 14, outline: "none", background: "#fff",
          }}
        />
        {["all", "pending", "confirmed", "cancelled", "expired"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{
            padding: "10px 18px", borderRadius: 50, border: "2px solid",
            borderColor: statusFilter === s ? "#FFD700" : "#eee",
            background: statusFilter === s ? "#FFF8DC" : "#fff",
            color: statusFilter === s ? "#B8860B" : "#888",
            fontWeight: 700, fontSize: 13, cursor: "pointer", textTransform: "capitalize",
          }}>{s === "all" ? "All" : s}</button>
        ))}
      </div>

      {/* Stats row */}
      {(() => {
        const stats = [
          { label: "Total", value: bookings.length, color: "#222" },
          { label: "Pending", value: bookings.filter(b => b.status === "pending").length, color: "#B8860B" },
          { label: "Confirmed", value: bookings.filter(b => b.status === "confirmed").length, color: "#2E7D32" },
          { label: "Revenue", value: "$" + bookings.filter(b => b.status !== "cancelled" && b.status !== "expired").reduce((s, b) => s + (b.totalPrice || 0), 0).toLocaleString(), color: "#1565C0" },
        ];
        return (
          <div style={{ display: "flex", gap: 16, padding: "0 28px 20px", flexWrap: "wrap" }}>
            {stats.map(s => (
              <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: "16px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", minWidth: 120 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        );
      })()}

      {/* Bookings list */}
      <div style={{ padding: "0 28px 40px" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", color: "#bbb", padding: 60, fontSize: 16 }}>No reservations found.</div>
        )}
        {filtered.map((b) => {
          const isOpen = expanded === b.id;
          const statusCfg = STATUS_COLORS[b.status] ?? STATUS_COLORS.pending;
          return (
            <div key={b.id} style={{
              background: "#fff", borderRadius: 16, marginBottom: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              border: isOpen ? "2px solid #FFD700" : "2px solid transparent",
              overflow: "hidden",
            }}>
              {/* Row */}
              <div
                onClick={() => setExpanded(isOpen ? null : b.id)}
                style={{ padding: "18px 24px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}
              >
                <div style={{ minWidth: 120 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#222" }}>{b.name}</div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{b.email}</div>
                </div>
                <div style={{ minWidth: 100 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#444" }}>{formatDate(b.date)}</div>
                  <div style={{ fontSize: 12, color: "#888" }}>{formatTime(b.startTime)} – {formatTime(b.endTime)}</div>
                </div>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#444" }}>{b.bouncerName}</div>
                  <div style={{ fontSize: 12, color: "#888" }}>{b.city}, {b.zip}</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <Badge map={STATUS_COLORS} value={b.status} />
                  <Badge map={PAYMENT_COLORS} value={b.paymentStatus} />
                </div>
                <div style={{ fontWeight: 800, fontSize: 16, color: "#222", minWidth: 70, textAlign: "right" }}>
                  ${b.totalPrice?.toLocaleString()}
                </div>
                <div style={{ color: "#bbb", fontSize: 18 }}>{isOpen ? "▲" : "▼"}</div>
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div style={{ borderTop: "1px solid #f0f0f0", padding: "20px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px 24px" }}>
                  {[
                    ["Phone", b.phone],
                    ["Email", b.email],
                    ["Address", `${b.address}, ${b.city} ${b.zip}`],
                    ["Surface", b.surface],
                    ["Delivery", b.deliveryType === "park" ? "Park / Public" : "Private Residence"],
                    ["Duration", b.durationType === "multiday" ? `Multi-day (+${b.extraDays} days)` : b.durationType === "overnight" ? "Overnight" : "Same Day"],
                    ["Generator", b.needsGenerator ? "Yes" : "No"],
                    ["Damage Waiver", b.damageWaiver ? "Yes" : "No"],
                    ["Promo Applied", b.promoApplied ? "Yes" : "No"],
                    ["Booking ID", b.id],
                    ["Created", b.createdAt ? new Date(b.createdAt).toLocaleString() : "—"],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{label}</div>
                      <div style={{ fontSize: 14, color: "#333", wordBreak: "break-word" }}>{val}</div>
                    </div>
                  ))}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>Add-ons</div>
                    <div style={{ fontSize: 14, color: "#333" }}>
                      <AddOnList addOns={b.addOns} tableQty={b.tableQty} chairQty={b.chairQty} />
                    </div>
                  </div>
                  {b.message && (
                    <div style={{ gridColumn: "1/-1" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>Message</div>
                      <div style={{ fontSize: 14, color: "#333" }}>{b.message}</div>
                    </div>
                  )}
                  {/* Pricing breakdown */}
                  <div style={{ gridColumn: "1/-1", background: "#FFFDF5", borderRadius: 12, padding: "16px 20px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Pricing Breakdown</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "8px 24px" }}>
                      {[
                        ["Total", `$${b.totalPrice?.toLocaleString()}`],
                        ["Deposit", `$${b.depositAmount}`],
                        ["Balance Due", `$${b.balanceDue?.toLocaleString()}`],
                        ["Tip", b.tipAmount ? `$${b.tipAmount}` : "None"],
                      ].map(([l, v]) => (
                        <div key={l} style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 13, color: "#888" }}>{l}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#222" }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
