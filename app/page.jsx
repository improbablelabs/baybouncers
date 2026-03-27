"use client";

import { useState, useEffect, useRef } from "react";
import { useCheckout } from "@/hooks/useCheckout";

const BOUNCERS = [
  { id: 1, name: "The Block Party", img: "🏰", photo: "/block.png", size: '13 H x 12.5 W x 13 L', capacity: "8 kids", price: 199, color: "#FFD700", desc: "Our most popular! A timeless castle design that kids absolutely love." },
  { id: 2, name: "Jelly Bean Castle", img: "🏰", photo: "/jelly.png", size: '14.5 H x 14 W x 26 L', capacity: "8 kids", price: 249, color: "#bf42f5", desc: "A castle with a slide, get the best of both worlds!" },
  { id: 3, name: "Ocean Wave Slide", img: "🌴", photo: "/ocean.png", size: '16 H x 8.4 W x 24.7 L ft', capacity: "2 kids", price: 299, color: "#42d7f5", desc: "A thrilling standalone water slide perfect for hot days." },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function BouncingDots() {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", padding: "18px 0" }}>
      {[0, 1, 2, 3, 4].map(i => (
        <div key={i} style={{
          width: 10, height: 10, borderRadius: "50%",
          background: i % 2 === 0 ? "#FFD700" : "#FFF",
          animation: `bayBounce 0.6s ease-in-out ${i * 0.1}s infinite alternate`,
        }} />
      ))}
    </div>
  );
}

function PromoBanner({ onNavigate, visible, onDismiss, onActivatePromo }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 110,
        background: "linear-gradient(90deg, #1A1A1A, #2D2000, #1A1A1A)",
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.4s ease",
        overflow: "hidden",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "8px 48px 8px 24px",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          flexWrap: "wrap", position: "relative", textAlign: "center",
        }}>
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.85)",
          }}>
            🎉 <span style={{ fontWeight: 700, color: "#FFD700" }}>FIRST RENTAL ONLY $50</span> + delivery when you share us on social media!
          </span>
          <button onClick={() => setShowModal(true)}
            style={{
              background: "#FFD700", color: "#1A1A1A", border: "none",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 12,
              padding: "5px 14px", borderRadius: 50, cursor: "pointer",
              transition: "transform 0.2s", flexShrink: 0,
            }}
            onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.target.style.transform = "none"}
          >LEARN MORE →</button>
          <button onClick={onDismiss}
            style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", color: "rgba(255,255,255,0.4)",
              fontSize: 18, cursor: "pointer", padding: "4px 8px", lineHeight: 1, flexShrink: 0,
            }}
            onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.8)"}
            onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}
          >×</button>
        </div>
      </div>

      {/* Intro Offer Modal */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", padding: 24,
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: "#fff", borderRadius: 28, maxWidth: 520, width: "100%", overflow: "hidden",
            boxShadow: "0 24px 80px rgba(0,0,0,0.25)", animation: "bayPopIn 0.3s ease-out",
          }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{
              background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
              padding: "36px 32px 28px", textAlign: "center", position: "relative",
            }}>
              <div style={{ fontSize: 48, marginBottom: 10 }}>👋</div>
              <h2 style={{
                fontFamily: "'Lilita One', cursive", fontSize: 28, color: "#fff",
                margin: "0 0 6px", textShadow: "0 2px 12px rgba(0,0,0,0.1)",
              }}>Hey, We're BayBouncers!</h2>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.9)", fontWeight: 500,
              }}>A local family-run business right here in the Bay</p>
            </div>

            {/* Body */}
            <div style={{ padding: "28px 32px 32px" }}>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#555",
                lineHeight: 1.75, marginBottom: 20,
              }}>
                We're a brand-new, family-owned bounce house rental company just getting started in the community. We know what it means to throw a great party on a budget and we're here to make it easy and affordable for your family.
              </p>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#555",
                lineHeight: 1.75, marginBottom: 24,
              }}>
                That's why we're offering your <strong style={{ color: "#222" }}>first rental for just $50</strong> plus the <strong style={{ color: "#222" }}>$60 delivery fee</strong>. All we ask is that you share your experience on social media and tag us! A quick post, story, or reel helps a small family business grow, and we genuinely appreciate every single customer who gives us a shot.
              </p>

              <div style={{
                background: "#FFFDF5", borderRadius: 14, padding: "18px 22px", marginBottom: 24,
                border: "2px solid #FFE88D",
              }}>
                <div style={{ fontFamily: "'Lilita One', cursive", fontSize: 18, color: "#FF8C00", marginBottom: 10 }}>🎉 The Deal</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#555", lineHeight: 1.8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Any bounce house rental</span>
                    <span><span style={{ textDecoration: "line-through", color: "#ccc", marginRight: 6 }}>$149 to $349</span><span style={{ fontWeight: 700, color: "#2ECC71" }}>$50</span></span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Delivery, setup & pickup</span>
                    <span style={{ fontWeight: 600, color: "#222" }}>$60</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #FFE88D", paddingTop: 8, marginTop: 8 }}>
                    <span style={{ fontWeight: 700, color: "#222" }}>You pay</span>
                    <span style={{ fontWeight: 800, color: "#FF8C00", fontSize: 18 }}>$110 total</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => { setShowModal(false); onActivatePromo(); onNavigate("book"); }}
                  style={{
                    flex: 1, background: "linear-gradient(135deg, #FFD700, #FFA500)", color: "#fff",
                    border: "none", fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 16,
                    padding: "15px 0", borderRadius: 14, cursor: "pointer",
                    boxShadow: "0 6px 24px rgba(255,165,0,0.3)", transition: "transform 0.2s",
                  }}
                  onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
                  onMouseLeave={e => e.target.style.transform = "none"}
                >Book for $50 🎈</button>
                <button onClick={() => setShowModal(false)}
                  style={{
                    background: "#f5f5f5", color: "#999", border: "none",
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14,
                    padding: "15px 20px", borderRadius: 14, cursor: "pointer",
                  }}>Maybe Later</button>
              </div>

              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#ccc",
                textAlign: "center", marginTop: 16, lineHeight: 1.5,
              }}>
                One free rental per household. Social media post must be shared within 7 days of your event.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Navbar({ onNavigate, bannerVisible }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    const resize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("scroll", fn);
    window.addEventListener("resize", resize);
    resize();
    return () => { window.removeEventListener("scroll", fn); window.removeEventListener("resize", resize); };
  }, []);
  const links = ["Home", "Inventory", "How It Works", "Payment", "Service Area", "FAQ"];
  return (
    <nav style={{
      position: "fixed", top: bannerVisible ? 40 : 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.08)" : "none",
      transition: "all 0.4s ease",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => onNavigate("home")}>
          <img src="/icon.png" alt="Bay Bouncers" style={{ width: 36, height: 36, objectFit: "contain" }} />
          <span style={{
            fontFamily: "'Lilita One', 'Fredoka One', cursive",
            fontSize: 26, fontWeight: 800,
            ...(scrolled ? {
              background: "linear-gradient(135deg, #FFD700, #FF8C00)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            } : {
              color: "#fff",
            }),
            transition: "all 0.4s ease",
          }}>BayBouncers</span>
        </div>
        <a href="tel:+18313329417" style={{
          display: isMobile ? "none" : "flex", alignItems: "center", gap: 6,
          textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
          fontSize: 14, fontWeight: 600,
          color: scrolled ? "#555" : "rgba(255,255,255,0.9)",
          transition: "color 0.4s ease",
        }}>
          <span style={{ fontSize: 16 }}>📞</span> (831) 332-9417
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          display: isMobile ? "block" : "none", background: "none", border: "none", fontSize: 28, cursor: "pointer", color: scrolled ? "#333" : "#fff",
        }}>☰</button>
        <div style={{
          display: "flex", gap: 8, alignItems: "center",
          ...(isMobile ? {
            display: menuOpen ? "flex" : "none",
            position: "absolute", top: "100%", left: 0, right: 0,
            flexDirection: "column", background: "#fff", padding: 20,
            boxShadow: "0 12px 40px rgba(0,0,0,0.12)"
          } : {})
        }}>
          {links.map(l => (
            <button key={l} onClick={() => { onNavigate(l.toLowerCase().replace(/ /g, "-")); setMenuOpen(false); }}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500,
                color: (scrolled || isMobile) ? "#333" : "#fff", padding: "8px 14px", borderRadius: 8,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.target.style.background = "rgba(255,215,0,0.15)"; e.target.style.color = "#FF8C00"; }}
              onMouseLeave={e => { e.target.style.background = "none"; e.target.style.color = (scrolled || isMobile) ? "#333" : "#fff"; }}
            >{l}</button>
          ))}
          <button onClick={() => { onNavigate("book"); setMenuOpen(false); }}
            style={{
              background: "linear-gradient(135deg, #FFD700, #FFA500)",
              border: "none", color: "#fff", fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700, fontSize: 15, padding: "10px 22px", borderRadius: 50,
              cursor: "pointer", boxShadow: "0 4px 16px rgba(255,165,0,0.35)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={e => { e.target.style.transform = "translateY(-2px) scale(1.04)"; }}
            onMouseLeave={e => { e.target.style.transform = "none"; }}
          >Book Now 🎉</button>
        </div>
        </div>
      </div>
    </nav>
  );
}

function Hero({ onNavigate }) {
  return (
    <section id="home" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      background: "linear-gradient(135deg, #FF8C00 0%, #FFD700 50%, #FFEC80 100%)",
      position: "relative", overflow: "hidden", padding: "120px 0 80px",
    }}>
      {/* Left text column */}
      <div style={{
        position: "relative", zIndex: 2, flex: "1 1 50%",
        padding: "0 48px 0 clamp(24px, 6vw, 96px)", maxWidth: 680,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <img src="/icon.png" alt="" style={{ width: 48, height: 48, objectFit: "contain" }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, color: "#5A3D00", letterSpacing: 1, textTransform: "uppercase" }}>Monterey Bay's Bounce Crew</span>
        </div>
        <h1 style={{
          fontFamily: "'Lilita One', 'Fredoka One', cursive",
          fontSize: "clamp(40px, 5.5vw, 72px)", fontWeight: 900,
          color: "#fff", lineHeight: 1.05, marginBottom: 20,
          textShadow: "0 4px 24px rgba(180,90,0,0.25)",
        }}>Bounce Into<br />the Fun!</h1>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(16px, 1.8vw, 20px)",
          color: "#4A3000", marginBottom: 36, lineHeight: 1.65, maxWidth: 480,
        }}>Affordable bounce house rentals for the Monterey Bay area. Birthday parties, events & backyard fun — delivered and set up for you!</p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <button onClick={() => onNavigate("book")}
            style={{
              background: "#fff", color: "#FF8C00", border: "none",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 17,
              padding: "15px 34px", borderRadius: 50, cursor: "pointer",
              boxShadow: "0 8px 30px rgba(0,0,0,0.14)", transition: "transform 0.2s",
            }}
            onMouseEnter={e => { e.target.style.transform = "translateY(-3px) scale(1.04)"; }}
            onMouseLeave={e => { e.target.style.transform = "none"; }}
          >Reserve by Date 📅</button>
          <button onClick={() => onNavigate("inventory")}
            style={{
              background: "rgba(74,48,0,0.12)", color: "#4A3000",
              border: "2px solid rgba(74,48,0,0.22)",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 17,
              padding: "13px 34px", borderRadius: 50, cursor: "pointer",
              backdropFilter: "blur(8px)", transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.target.style.background = "rgba(74,48,0,0.2)"; }}
            onMouseLeave={e => { e.target.style.background = "rgba(74,48,0,0.12)"; }}
          >Browse Inventory ✨</button>
        </div>
        <div style={{ marginTop: 40, display: "flex", gap: 32, flexWrap: "wrap" }}>
          {[{ icon: "⭐", label: "200+ Events" }, { icon: "🛡️", label: "Fully Insured" }].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, color: "#5A3D00", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>
              <span style={{ fontSize: 20 }}>{s.icon}</span> {s.label}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20, background: "rgba(74,48,0,0.08)", borderRadius: 50, padding: "9px 22px", display: "inline-block" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: "#5A3D00" }}>🚚 </span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#5A3D00" }}>Watsonville · Aptos · Capitola · Santa Cruz · Scotts Valley · Gilroy · San Jose</span>
        </div>
      </div>

      {/* Right image column */}
      <div style={{
        flex: "1 1 50%", position: "relative", alignSelf: "stretch",
        minHeight: 500, display: "flex", alignItems: "center",
      }}>
        <img
          src="/banner.png"
          alt="The Block Party bounce house"
          style={{
            width: "85%", height: "85%", objectFit: "contain",
            objectPosition: "center", display: "block", margin: "auto",
          }}
        />
      </div>

      <svg viewBox="0 0 1440 120" style={{ position: "absolute", bottom: -2, left: 0, width: "100%", zIndex: 3 }}>
        <path d="M0,80 C360,20 720,120 1440,60 L1440,120 L0,120 Z" fill="#fff" />
      </svg>
    </section>
  );
}

function InventoryCard({ b, index, onReserve }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      background: "#fff", borderRadius: 20, overflow: "hidden",
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)",
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)",
      transitionDelay: `${index * 0.08}s`,
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.06)"; }}
    >
      <div style={{
        height: 200, display: "flex", alignItems: "center", justifyContent: "center",
        background: `linear-gradient(135deg, ${b.color}22, ${b.color}44)`, fontSize: 80, overflow: "hidden",
      }}>
        {b.photo
          ? <img src={b.photo} alt={b.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
          : <span style={{ animation: "bayBounce 2s ease-in-out infinite alternate" }}>{b.img}</span>}
      </div>
      <div style={{ padding: "20px 24px 24px" }}>
        <h3 style={{ fontFamily: "'Lilita One', cursive", fontSize: 22, color: "#222", margin: "0 0 6px" }}>{b.name}</h3>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#777", margin: "0 0 14px", lineHeight: 1.5 }}>{b.desc}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 16, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#999" }}>
            <span>📐 {b.size}</span><span>👶 {b.capacity}</span>
          </div>
          <button onClick={() => onReserve()}
            style={{
              background: `linear-gradient(135deg, ${b.color}, ${b.color}CC)`,
              color: "#fff", border: "none", fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700, fontSize: 13, padding: "8px 18px", borderRadius: 50,
              cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: `0 3px 12px ${b.color}44`,
            }}
            onMouseEnter={e => { e.target.style.transform = "scale(1.06)"; }}
            onMouseLeave={e => { e.target.style.transform = "none"; }}
          >Reserve</button>
        </div>
      </div>
    </div>
  );
}

function Inventory({ onNavigate }) {
  return (
    <section id="inventory" style={{ padding: "80px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "#FFD700", textTransform: "uppercase", letterSpacing: 2 }}>Our Fleet</span>
          <h2 style={{ fontFamily: "'Lilita One', cursive", fontSize: "clamp(32px, 5vw, 48px)", color: "#222", margin: "8px 0 12px" }}>Meet the Bouncers</h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "#888", maxWidth: 520, margin: "0 auto" }}>
            All inflatables are cleaned & sanitized between every rental. Delivered, set up, and picked up by our crew.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 28 }}>
          {BOUNCERS.map((b, i) => <InventoryCard key={b.id} b={b} index={i} onReserve={() => onNavigate("book")} />)}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: "📅", title: "Pick a Date", desc: "Choose your event date to see which bouncers are available." },
    { icon: "🎪", title: "Choose a Bouncer", desc: "Browse what's open on your date and pick the perfect one." },
    { icon: "📝", title: "Send Your Info", desc: "Fill out a quick form and pay a $60 deposit to reserve your date. We'll send a confirmation text or email within 24 hours." },
    { icon: "🎉", title: "Bounce All Day!", desc: "We deliver, set up, and pick up. You just enjoy the party!" },
  ];
  const [ref, visible] = useInView();
  return (
    <section id="how-it-works" ref={ref} style={{ padding: "80px 24px", background: "linear-gradient(180deg, #FFF9E0 0%, #FFFDF5 100%)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "#FFD700", textTransform: "uppercase", letterSpacing: 2 }}>Simple Process</span>
        <h2 style={{ fontFamily: "'Lilita One', cursive", fontSize: "clamp(32px, 5vw, 48px)", color: "#222", margin: "8px 0 48px" }}>How It Works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)",
              transition: `all 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.12}s`,
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%", background: "#fff",
                boxShadow: "0 4px 24px rgba(255,215,0,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 36, margin: "0 auto 16px",
              }}>{s.icon}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 800, color: "#FFD700", marginBottom: 8, letterSpacing: 1 }}>STEP {i + 1}</div>
              <h3 style={{ fontFamily: "'Lilita One', cursive", fontSize: 20, color: "#222", margin: "0 0 8px" }}>{s.title}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#888", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="payment" style={{ padding: "80px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "#FFD700", textTransform: "uppercase", letterSpacing: 2 }}>Payment</span>
        <h2 style={{ fontFamily: "'Lilita One', cursive", fontSize: "clamp(32px, 5vw, 48px)", color: "#222", margin: "8px 0 16px" }}>Easy & Flexible</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "#888", maxWidth: 560, margin: "0 auto 48px" }}>
          We make paying simple. Choose whatever works best for you.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, marginBottom: 36 }}>
          {/* Pay Online */}
          <div style={{
            background: "linear-gradient(135deg, #FFF9E0, #FFFDF5)", borderRadius: 20,
            padding: "36px 28px", border: "2px solid #FFE88D", textAlign: "center",
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%", background: "#fff",
              boxShadow: "0 4px 16px rgba(255,215,0,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 30, margin: "0 auto 18px",
            }}>💳</div>
            <h3 style={{ fontFamily: "'Lilita One', cursive", fontSize: 22, color: "#222", margin: "0 0 10px" }}>Pay Online</h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#777", lineHeight: 1.65, margin: 0 }}>
              Pay securely through our website when you book. Full payment or deposit, your choice.
            </p>
          </div>

          {/* Pay in Cash */}
          <div style={{
            background: "linear-gradient(135deg, #FFF9E0, #FFFDF5)", borderRadius: 20,
            padding: "36px 28px", border: "2px solid #FFE88D", textAlign: "center",
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%", background: "#fff",
              boxShadow: "0 4px 16px rgba(255,215,0,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 30, margin: "0 auto 18px",
            }}>💵</div>
            <h3 style={{ fontFamily: "'Lilita One', cursive", fontSize: 22, color: "#222", margin: "0 0 10px" }}>Pay with Cash</h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#777", lineHeight: 1.65, margin: 0 }}>
              Prefer cash? No problem! Pay our delivery crew in person on the day of your event.
            </p>
          </div>

          {/* Deposit */}
          <div style={{
            background: "linear-gradient(135deg, #FFF9E0, #FFFDF5)", borderRadius: 20,
            padding: "36px 28px", border: "2px solid #FFE88D", textAlign: "center",
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%", background: "#fff",
              boxShadow: "0 4px 16px rgba(255,215,0,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 30, margin: "0 auto 18px",
            }}>🔒</div>
            <h3 style={{ fontFamily: "'Lilita One', cursive", fontSize: 22, color: "#222", margin: "0 0 10px" }}>Deposit to Reserve</h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#777", lineHeight: 1.65, margin: 0 }}>
              A small deposit locks in your date and covers delivery costs in case of cancellation. The rest is due on event day.
            </p>
          </div>
        </div>

        {/* Fine print */}
        <div style={{
          background: "#FAFAFA", borderRadius: 16, padding: "20px 28px",
          maxWidth: 640, margin: "0 auto",
          fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#999", lineHeight: 1.8, textAlign: "left",
        }}>
          <div style={{ fontWeight: 700, color: "#555", marginBottom: 6 }}>Good to know:</div>
          <div>• Full payment is due on delivery day and is charged automatically unless cancelled.</div>
          <div>• Deposits are non-refundable but remain as credit toward a future booking.</div>
          <div>• Any payments made toward the balance are also non-refundable but never expire.</div>
        </div>
      </div>
    </section>
  );
}

function ServiceArea() {
  const regions = [
    {
      area: "South County",
      cities: ["Watsonville", "Freedom", "Pajaro", "Aptos", "La Selva Beach", "Rio Del Mar"],
      color: "#FF6B35",
    },
    {
      area: "Santa Cruz",
      cities: ["Santa Cruz", "Capitola", "Soquel", "Live Oak", "Pleasure Point", "Scotts Valley", "Bonny Doon", "Felton", "Ben Lomond", "Boulder Creek"],
      color: "#FFD700",
    },
    {
      area: "South Valley",
      cities: ["Gilroy", "Morgan Hill", "San Martin", "Hollister"],
      color: "#4ECDC4",
    },
    {
      area: "Silicon Valley",
      cities: ["San Jose", "Campbell", "Los Gatos", "Saratoga", "Cupertino", "Sunnyvale", "Santa Clara", "Milpitas"],
      color: "#FF69B4",
    },
  ];

  const [ref, visible] = useInView();

  return (
    <section id="service-area" ref={ref} style={{ padding: "80px 24px", background: "linear-gradient(180deg, #FFF9E0 0%, #FFFDF5 100%)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "#FFD700", textTransform: "uppercase", letterSpacing: 2 }}>Service Area</span>
          <h2 style={{ fontFamily: "'Lilita One', cursive", fontSize: "clamp(32px, 5vw, 48px)", color: "#222", margin: "8px 0 12px" }}>We Come to You!</h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "#888", maxWidth: 520, margin: "0 auto" }}>
            We deliver, set up, and pick up across the greater Monterey Bay and Silicon Valley area.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 36 }}>
          {regions.map((r, ri) => (
            <div key={ri} style={{
              background: "#fff", borderRadius: 18, padding: "24px 22px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              borderTop: `4px solid ${r.color}`,
              opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)",
              transition: `all 0.5s cubic-bezier(0.22,1,0.36,1) ${ri * 0.1}s`,
            }}>
              <div style={{
                fontFamily: "'Lilita One', cursive", fontSize: 18, color: r.color, marginBottom: 12,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ fontSize: 20 }}>📍</span> {r.area}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {r.cities.map((c, ci) => (
                  <span key={ci} style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
                    color: "#555", background: "#f7f7f7", padding: "5px 12px", borderRadius: 50,
                  }}>{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          textAlign: "center", background: "#fff", borderRadius: 16, padding: "20px 28px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)", maxWidth: 600, margin: "0 auto",
        }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#888", margin: 0 }}>
            Don't see your city? <strong style={{ color: "#FF8C00" }}>Reach out anyway!</strong> We may still be able to deliver to your area.
          </p>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(null);
  const toggle = (i) => setOpen(open === i ? null : i);

  const faqs = [
    {
      q: "What areas do you deliver to?",
      a: "We deliver from Watsonville all the way up to San Jose, covering Aptos, Capitola, Soquel, Santa Cruz, Scotts Valley, Gilroy, Morgan Hill, Campbell, Los Gatos, Saratoga, Cupertino, Sunnyvale, Santa Clara, and Milpitas. Don't see your city? Reach out and we may still be able to help!",
    },
    {
      q: "How far in advance do I need to book?",
      a: "We require at least 24 hours advance notice. That said, we recommend booking as early as possible, especially for weekends and holidays, as our most popular bouncers book up quickly.",
    },
    {
      q: "What is the $60 deposit for?",
      a: "The $60 non-refundable deposit secures your booking date and covers delivery logistics. It remains as credit toward a future booking if you need to cancel. The remaining balance is due on delivery day and can be paid with cash or card.",
    },
    {
      q: "What if I don't have an electrical outlet nearby?",
      a: "No problem! We offer generator rentals for $120 that keep the bounce house inflated all day. Just select the generator add-on during checkout.",
    },
    {
      q: "What surfaces can the bounce house be set up on?",
      a: "We can set up on grass, turf, dirt, bark, concrete, and asphalt. Grass and turf are ideal since we can stake the inflatable directly. Hard surfaces like concrete and asphalt require sandbag anchoring (+$12), and surfaces like dirt or bark require a protective tarp underneath (+$50).",
    },
    {
      q: "Do you set up and take down the bounce house?",
      a: "Yes! Our crew handles everything. For home deliveries, we drop off in the morning and pick up the next day (24-hour rental window). For park deliveries, we arrive 1 hour before your event to set up and return 1 hour after to take it down.",
    },
    {
      q: "What happens if it rains on my event day?",
      a: "Safety comes first. If the weather makes it unsafe to operate the bounce house, we'll work with you to reschedule at no extra cost. Your deposit stays as credit toward the new date.",
    },
    {
      q: "Are the bounce houses clean and sanitized?",
      a: "Absolutely! Every inflatable is thoroughly cleaned and sanitized between each rental. We take hygiene seriously so your kids can bounce worry-free.",
    },
    {
      q: "Can I keep the bounce house overnight or for multiple days?",
      a: "Yes! Overnight rentals are available for a flat $50 fee. Multi-day rentals are charged at 50% of the daily rental rate for each additional day. Just select your preferred duration when booking.",
    },
    {
      q: "Is there an age or weight limit?",
      a: "Each bounce house has its own capacity listed on the booking page. Generally, our inflatables are designed for children, but some larger units can accommodate teens and adults. Please follow the posted capacity limits for everyone's safety.",
    },
    {
      q: "What is the damage waiver?",
      a: "The optional damage waiver (10% of the rental price) covers accidental damage to the inflatable during your event. Without it, you would be responsible for repair or replacement costs if damage occurs.",
    },
    {
      q: "How does the $50 first-time deal work?",
      a: "Your first rental with us is only $50 (plus the $60 delivery fee). All we ask is that you share your experience on social media and tag us! It's our way of getting the word out as a new local family business. One deal per household, and the social media post should go up within 7 days of your event.",
    },
  ];

  const [ref, visible] = useInView();

  return (
    <section id="faq" ref={ref} style={{ padding: "80px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "#FFD700", textTransform: "uppercase", letterSpacing: 2 }}>FAQ</span>
          <h2 style={{ fontFamily: "'Lilita One', cursive", fontSize: "clamp(32px, 5vw, 48px)", color: "#222", margin: "8px 0 12px" }}>Questions? We've Got Answers</h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "#888", maxWidth: 480, margin: "0 auto" }}>
            Everything you need to know about renting with BayBouncers.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {faqs.map((faq, i) => (
            <div key={i}
              style={{
                background: open === i ? "#FFFDF5" : "#FAFAFA",
                border: open === i ? "2px solid #FFE88D" : "2px solid transparent",
                borderRadius: 16, overflow: "hidden",
                transition: "all 0.3s ease",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${i * 0.04}s`,
              }}
            >
              <button onClick={() => toggle(i)}
                style={{
                  width: "100%", padding: "18px 22px", background: "none", border: "none",
                  cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
                  gap: 16, textAlign: "left",
                }}
              >
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600,
                  color: open === i ? "#FF8C00" : "#333",
                }}>{faq.q}</span>
                <span style={{
                  fontSize: 20, fontWeight: 700, color: open === i ? "#FF8C00" : "#ccc",
                  transition: "transform 0.3s ease",
                  transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                  flexShrink: 0,
                }}>+</span>
              </button>
              <div style={{
                maxHeight: open === i ? 300 : 0,
                overflow: "hidden",
                transition: "max-height 0.4s ease",
              }}>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#666",
                  lineHeight: 1.7, padding: "0 22px 20px", margin: 0,
                }}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          textAlign: "center", marginTop: 36,
          fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#888",
        }}>
          Still have questions? Call us at <a href="tel:+18313329417" style={{ color: "#FF8C00", fontWeight: 700, textDecoration: "none" }}>(831) 332-9417</a>
        </div>
      </div>
    </section>
  );
}

function StepIndicator({ step }) {
  const labels = ["Date", "Time", "Bouncer", "Details"];
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 40, flexWrap: "wrap" }}>
      {labels.map((l, i) => {
        const active = i + 1 <= step;
        const current = i + 1 === step;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 14,
              background: active ? "linear-gradient(135deg, #FFD700, #FFA500)" : "#eee",
              color: active ? "#fff" : "#bbb",
              boxShadow: current ? "0 4px 16px rgba(255,165,0,0.35)" : "none",
              transition: "all 0.3s",
            }}>{i + 1}</div>
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
              color: active ? "#FF8C00" : "#bbb", transition: "color 0.3s",
            }}>{l}</span>
            {i < 3 && <div style={{ width: 40, height: 2, background: active ? "#FFD700" : "#eee", borderRadius: 2, transition: "background 0.3s" }} />}
          </div>
        );
      })}
    </div>
  );
}

function BookingWizard({ promoActive }) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedBouncer, setSelectedBouncer] = useState(null);
  const [timing, setTiming] = useState({
    startTime: "", endTime: "", durationType: "sameday", extraDays: 1,
  });
  const [form, setForm] = useState({
    name: "", email: "", phone: "", message: "",
    address: "", city: "", zip: "",
    surface: "", deliveryType: "", tipPercent: 0,
    damageWaiver: false, needsGenerator: false,
    addOns: {}, tableQty: 1, chairQty: 1,
  });
  const [checks, setChecks] = useState({
    clearPath: false,
    noSteps: false,
    enoughSpace: false,
    noPowerLines: false,
    hasOutlet: false,
    paymentTerms: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [available, setAvailable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableInventory, setAvailableInventory] = useState({ table: null, chair: null });

  // Stripe checkout hook
  const { checkout, bookWithCash, submitting, error: checkoutError, setError: setCheckoutError } = useCheckout();

  const dateInputRef = useRef(null);

  const MIN_BOOKING_DAYS_AHEAD = 9; // change this to adjust minimum lead time
  const minDateObj = new Date();
  minDateObj.setDate(minDateObj.getDate() + MIN_BOOKING_DAYS_AHEAD);
  const minDate = minDateObj.toISOString().split("T")[0];
  const minDateFormatted = new Date(minDate + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const [dateError, setDateError] = useState("");

  const handleDateSelect = (date) => {
    if (date < minDate) {
      setDateError(`We're booked out until ${minDateFormatted} — please select a date on or after that.`);
      return;
    }
    setDateError("");
    setSelectedDate(date);
    setStep(2);
  };

  // Generate 30-min time slots
  const timeSlots = [];
  for (let h = 10; h <= 19; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === 19 && m > 0) break;
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
      timeSlots.push({ value: `${hh}:${mm}`, label: `${h12}:${mm} ${ampm}` });
    }
  }

  // Check availability via server API
  const handleTimingConfirm = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        date: selectedDate,
        durationType: timing.durationType,
        extraDays: timing.extraDays,
        startTime: timing.startTime,
      });
      const res = await fetch(`/api/availability?${params}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setAvailable(data.available);
      setSelectedBouncer(null);
      setStep(3);
    } catch (err) {
      console.error("Error checking availability:", err);
      alert("Couldn't load availability. Please try again.");
    }
    setLoading(false);
  };

  const handleBouncerSelect = (b) => {
    setSelectedBouncer(b);
    setStep(4);
  };

  // Submit booking via Stripe Checkout ($60 deposit)
  const handleSubmit = async () => {
    setCheckoutError(null);
    const bookingPayload = {
      ...form,
      bouncerId: selectedBouncer.id,
      bouncerName: selectedBouncer.name,
      bouncerPrice: selectedBouncer.price,
      date: selectedDate,
      startTime: timing.startTime,
      endTime: timing.endTime,
      durationType: timing.durationType,
      extraDays: timing.extraDays,
      promoApplied: promoActive,
    };

    const result = await checkout(bookingPayload);
    // If successful, customer is redirected to Stripe Checkout
    // They return to /booking/success after paying
    // If Stripe redirect fails for some reason, show submitted state
    if (result && !result.redirecting && result.success) {
      setSubmitted(true);
    }
  };

  // Alternative: book with cash (no Stripe, saved as pending)
  const handleCashBooking = async () => {
    setCheckoutError(null);
    const bookingPayload = {
      ...form,
      bouncerId: selectedBouncer.id,
      bouncerName: selectedBouncer.name,
      bouncerPrice: selectedBouncer.price,
      date: selectedDate,
      startTime: timing.startTime,
      endTime: timing.endTime,
      durationType: timing.durationType,
      extraDays: timing.extraDays,
      promoApplied: promoActive,
    };

    const result = await bookWithCash(bookingPayload);
    if (result.success) {
      setSubmitted(true);
    }
  };

  const handleBack = () => {
    if (step === 4) { setSelectedBouncer(null); setStep(3); }
    else if (step === 3) { setAvailable([]); setStep(2); }
    else if (step === 2) { setSelectedDate(""); setTiming({ startTime: "", endTime: "", durationType: "sameday", extraDays: 1 }); setStep(1); }
  };

  const handleReset = () => {
    setStep(1); setSelectedDate(""); setSelectedBouncer(null);
    setTiming({ startTime: "", endTime: "", durationType: "sameday", extraDays: 1 });
    setForm({ name: "", email: "", phone: "", message: "", address: "", city: "", zip: "", surface: "", deliveryType: "", tipPercent: 0, damageWaiver: false, needsGenerator: false, addOns: {}, tableQty: 1, chairQty: 1 });
    setChecks({ clearPath: false, noSteps: false, enoughSpace: false, noPowerLines: false, hasOutlet: false, paymentTerms: false });
    setSubmitted(false);
  };

  // Price helper: calculates extra days / overnight cost
  const getExtraCost = (basePrice) => {
    if (timing.durationType === "overnight") return 50;
    if (timing.durationType === "multiday") return Math.round(basePrice * 0.5) * timing.extraDays;
    return 0;
  };

  const formatTime = (t) => {
    if (!t) return "";
    const slot = timeSlots.find(s => s.value === t);
    return slot ? slot.label : t;
  };
  const getDurationLabel = () => {
    if (timing.durationType === "overnight") return "Overnight (+$50)";
    if (timing.durationType === "multiday") return `Multi-day (${timing.extraDays + 1} days)`;
    return "Same day";
  };

  const formatDate = (d) => {
    if (!d) return "";
    const dt = new Date(d + "T12:00:00");
    return dt.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };

  const inputStyle = {
    width: "100%", padding: "14px 18px", borderRadius: 12,
    border: "2px solid #eee", fontFamily: "'DM Sans', sans-serif",
    fontSize: 15, outline: "none", transition: "border-color 0.2s",
    boxSizing: "border-box", background: "#FAFAFA",
  };

  /* ── SUCCESS STATE ── */
  if (submitted) {
    return (
      <section id="book" style={{ padding: "80px 24px", background: "linear-gradient(180deg, #FFFDF5, #FFF9E0)" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 80, marginBottom: 20, animation: "bayBounce 1s ease-in-out infinite alternate" }}>🎉</div>
          <h2 style={{ fontFamily: "'Lilita One', cursive", fontSize: 36, color: "#222", marginBottom: 12 }}>You're All Set!</h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "#888", lineHeight: 1.6, marginBottom: 8 }}>
            We've got your reservation request for:
          </p>
          <div style={{
            background: "#fff", borderRadius: 16, padding: 20, display: "inline-flex",
            alignItems: "center", gap: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", marginBottom: 16,
          }}>
            {selectedBouncer?.photo
              ? <img src={selectedBouncer.photo} alt={selectedBouncer.name} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }} />
              : <span style={{ fontSize: 48 }}>{selectedBouncer?.img}</span>}
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "'Lilita One', cursive", fontSize: 20, color: "#222" }}>{selectedBouncer?.name}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#888" }}>{formatDate(selectedDate)} · {formatTime(timing.startTime)} to {formatTime(timing.endTime)}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#aaa" }}>{getDurationLabel()}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 800, color: "#FF8C00" }}>
                Total: ${(() => {
                  const rental = promoActive ? 50 : selectedBouncer?.price;
                  const extra = getExtraCost(selectedBouncer?.price);
                  const delivery = 60;
                  const park = form.deliveryType === "park" ? 20 : 0;
                  const generator = form.needsGenerator ? 120 : 0;
                  const surfaceFee = ["Concrete","Asphalt"].includes(form.surface) ? 12 : ["Dirt","Bark"].includes(form.surface) ? 50 : 0;
                  const addOnsTotal = Object.values(form.addOns).reduce((a, b) => a + b, 0);
                  const waiver = form.damageWaiver ? selectedBouncer?.price * 0.10 : 0;
                  const tip = 60 * form.tipPercent / 100;
                  return (rental + extra + delivery + park + generator + surfaceFee + addOnsTotal + waiver + tip).toFixed(2);
                })()}
              </div>
            </div>
          </div>
          <div style={{
            background: "#FFFDF5", borderRadius: 12, padding: "14px 20px", marginBottom: 20,
            border: "1px solid #FFE88D", display: "inline-block", textAlign: "left",
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#666", lineHeight: 2,
          }}>
            <div>👤 {form.name} · {form.phone}</div>
            <div>📍 {form.address}, {form.city} {form.zip}</div>
            <div>🚚 {form.deliveryType === "park" ? "Park Delivery (1 hr before/after)" : "Home Delivery (24-hour window)"}</div>
            <div>🏕️ Surface: {form.surface}</div>
            {form.needsGenerator && <div>⚡ Generator rental included</div>}
            {form.damageWaiver && <div>🛡️ Damage waiver included</div>}
            {Object.keys(form.addOns).length > 0 && <div>🎈 Add-ons: {Object.keys(form.addOns).length} item{Object.keys(form.addOns).length > 1 ? "s" : ""}</div>}
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#aaa", lineHeight: 1.6, display: "block" }}>
            We'll reach out within 24 hours to confirm and arrange payment.
          </p>
          <button onClick={handleReset} style={{
            marginTop: 24, background: "linear-gradient(135deg, #FFD700, #FFA500)",
            color: "#fff", border: "none", fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700, fontSize: 16, padding: "14px 32px", borderRadius: 50, cursor: "pointer",
          }}>Book Another 🎈</button>
        </div>
      </section>
    );
  }

  /* ── WIZARD ── */
  return (
    <section id="book" style={{ padding: "80px 24px", background: "linear-gradient(180deg, #FFFDF5, #FFF9E0)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "#FFD700", textTransform: "uppercase", letterSpacing: 2 }}>Book Now</span>
          <h2 style={{ fontFamily: "'Lilita One', cursive", fontSize: "clamp(32px, 5vw, 48px)", color: "#222", margin: "8px 0 8px" }}>Reserve Your Bouncer</h2>
        </div>

        <StepIndicator step={step} />

        {step > 1 && (
          <button onClick={handleBack} style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#FF8C00",
            display: "flex", alignItems: "center", gap: 6, marginBottom: 20, padding: 0,
          }}>← Back</button>
        )}

        {/* STEP 1: DATE */}
        {step === 1 && (
          <div style={{
            background: "#fff", borderRadius: 24, padding: "48px 40",
            boxShadow: "0 8px 40px rgba(0,0,0,0.06)", textAlign: "center",
            maxWidth: 520, margin: "0 auto", animation: "bayPopIn 0.3s ease-out",
          }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📅</div>
            <h3 style={{ fontFamily: "'Lilita One', cursive", fontSize: 26, color: "#222", margin: "0 0 8px" }}>When's the party?</h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#888", marginBottom: 28 }}>
              Select your event date and we'll show you what's available.
            </p>
            {/* Desktop date picker */}
            <div className="date-desktop">
              <input type="date" min={minDate} value={selectedDate}
                onChange={e => handleDateSelect(e.target.value)}
                style={{
                  maxWidth: 300, width: "100%", margin: "0 auto", display: "block",
                  fontSize: 18, padding: "16px 20px", cursor: "pointer",
                  borderRadius: 12, border: "2px solid #FFE88D", fontFamily: "'DM Sans', sans-serif",
                  outline: "none", boxSizing: "border-box", background: "#fff",
                  color: "#222", colorScheme: "light",
                }}
                onFocus={e => e.target.style.borderColor = "#FFD700"}
                onBlur={e => e.target.style.borderColor = "#FFE88D"}
              />
            </div>

            {/* Mobile date picker — overlay label triggers native picker */}
            <div className="date-mobile">
              <div style={{ maxWidth: 300, width: "100%", margin: "0 auto", position: "relative" }}>
                <input
                  ref={dateInputRef}
                  type="date"
                  min={minDate}
                  value={selectedDate}
                  onChange={e => {
                    setSelectedDate(e.target.value);
                    if (e.target.value < minDate) {
                      setDateError(`We're booked out until ${minDateFormatted} — please select a date on or after that.`);
                    } else {
                      setDateError("");
                    }
                  }}
                  style={{
                    position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                    opacity: 0, cursor: "pointer", zIndex: 2,
                  }}
                />
                <div
                  onClick={() => dateInputRef.current?.showPicker?.() ?? dateInputRef.current?.click()}
                  style={{
                    padding: "16px 20px", borderRadius: 12, border: `2px solid ${selectedDate ? "#FFD700" : "#FFE88D"}`,
                    fontFamily: "'DM Sans', sans-serif", fontSize: 18, background: "#fff",
                    color: selectedDate ? "#222" : "#aaa", textAlign: "center", cursor: "pointer",
                    boxSizing: "border-box", userSelect: "none",
                  }}
                >
                  {selectedDate
                    ? new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })
                    : "Select a date"}
                </div>
              </div>
              {selectedDate && (
                <button
                  onClick={() => handleDateSelect(selectedDate)}
                  style={{
                    marginTop: 16, padding: "14px 36px", borderRadius: 50,
                    background: "linear-gradient(135deg, #FFD700, #FFA500)",
                    color: "#fff", fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer",
                  }}
                >See What's Available →</button>
              )}
            </div>
            {dateError && (
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#e74c3c", marginTop: 12 }}>
                {dateError}
              </p>
            )}
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#ccc", marginTop: 16 }}>
              We book 24 hours in advance minimum
            </p>
          </div>
        )}

        {/* STEP 2: PARTY TIME & DURATION */}
        {step === 2 && (
          <div style={{
            background: "#fff", borderRadius: 24, padding: "40px 36px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
            maxWidth: 520, margin: "0 auto", animation: "bayPopIn 0.3s ease-out",
          }}>
            <button onClick={handleBack} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#FF8C00",
              display: "flex", alignItems: "center", gap: 4, marginBottom: 16,
            }}>← Change Date</button>

            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>⏰</div>
              <h3 style={{ fontFamily: "'Lilita One', cursive", fontSize: 24, color: "#222", margin: "0 0 4px" }}>Party Time</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#888" }}>
                {formatDate(selectedDate)}
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div>
                <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 6, display: "block" }}>Start Time *</label>
                <select value={timing.startTime} onChange={e => {
                    const newStart = e.target.value;
                    setTiming({ ...timing, startTime: newStart, endTime: timing.endTime && timing.endTime <= newStart ? "" : timing.endTime });
                  }}
                  style={{ ...inputStyle, cursor: "pointer", appearance: "auto" }}
                  onFocus={e => e.target.style.borderColor = "#FFD700"} onBlur={e => e.target.style.borderColor = "#eee"}>
                  <option value="">Select...</option>
                  {timeSlots.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 6, display: "block" }}>End Time *</label>
                <select value={timing.endTime} onChange={e => setTiming({ ...timing, endTime: e.target.value })}
                  style={{ ...inputStyle, cursor: "pointer", appearance: "auto" }}
                  onFocus={e => e.target.style.borderColor = "#FFD700"} onBlur={e => e.target.style.borderColor = "#eee"}>
                  <option value="">Select...</option>
                  {timeSlots.filter(t => !timing.startTime || t.value > timing.startTime).map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>

            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 10 }}>Rental Duration</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {[
                { value: "sameday", icon: "☀️", label: "Same Day", desc: "Delivered and picked up on your event day", extra: "" },
                { value: "overnight", icon: "🌙", label: "Overnight", desc: "Picked up the next morning", extra: "+$50" },
                { value: "multiday", icon: "📆", label: "Multi-Day", desc: "50% of rental price per additional day", extra: "+50%/day" },
              ].map(d => (
                <div key={d.value}
                  onClick={() => setTiming({ ...timing, durationType: d.value, extraDays: d.value === "multiday" ? timing.extraDays : 1 })}
                  style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "14px 18px",
                    borderRadius: 14, cursor: "pointer", transition: "all 0.2s",
                    border: timing.durationType === d.value ? "2px solid #FFD700" : "2px solid #eee",
                    background: timing.durationType === d.value ? "#FFFDF5" : "#FAFAFA",
                  }}
                >
                  <span style={{ fontSize: 24 }}>{d.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 15,
                      fontWeight: timing.durationType === d.value ? 700 : 500,
                      color: timing.durationType === d.value ? "#FF8C00" : "#333",
                    }}>{d.label}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#999" }}>{d.desc}</div>
                  </div>
                  {d.extra && (
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
                      color: timing.durationType === d.value ? "#FF8C00" : "#bbb",
                      background: timing.durationType === d.value ? "#FFD70022" : "#f0f0f0",
                      padding: "4px 10px", borderRadius: 50,
                    }}>{d.extra}</span>
                  )}
                </div>
              ))}
            </div>

            {timing.durationType === "multiday" && (
              <div style={{ marginBottom: 28 }}>
                <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 8, display: "block" }}>
                  How many extra days?
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <button onClick={() => setTiming({ ...timing, extraDays: Math.max(1, timing.extraDays - 1) })}
                    style={{
                      width: 40, height: 40, borderRadius: 10, border: "2px solid #eee",
                      background: "#FAFAFA", fontSize: 20, cursor: "pointer", fontWeight: 700, color: "#888",
                    }}>−</button>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 800, color: "#222", minWidth: 40, textAlign: "center" }}>
                    {timing.extraDays}
                  </span>
                  <button onClick={() => setTiming({ ...timing, extraDays: timing.extraDays + 1 })}
                    style={{
                      width: 40, height: 40, borderRadius: 10, border: "2px solid #FFD700",
                      background: "#FFFDF5", fontSize: 20, cursor: "pointer", fontWeight: 700, color: "#FF8C00",
                    }}>+</button>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#888" }}>
                    = {timing.extraDays + 1} days total
                  </span>
                </div>
              </div>
            )}

            <button onClick={handleTimingConfirm}
              disabled={!timing.startTime || !timing.endTime || loading}
              style={{
                width: "100%",
                background: timing.startTime && timing.endTime && !loading ? "linear-gradient(135deg, #FFD700, #FFA500)" : "#e5e5e5",
                color: timing.startTime && timing.endTime && !loading ? "#fff" : "#aaa",
                border: "none", fontFamily: "'DM Sans', sans-serif",
                fontWeight: 800, fontSize: 17, padding: "15px 0", borderRadius: 14,
                cursor: timing.startTime && timing.endTime && !loading ? "pointer" : "not-allowed",
                boxShadow: timing.startTime && timing.endTime && !loading ? "0 6px 24px rgba(255,165,0,0.3)" : "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { if (timing.startTime && timing.endTime && !loading) e.target.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.target.style.transform = "none"; }}
            >{loading ? "Checking availability..." : "See Available Bouncers →"}</button>
          </div>
        )}

        {/* STEP 3: AVAILABLE BOUNCERS */}
        {step === 3 && (
          <div style={{ animation: "bayPopIn 0.3s ease-out" }}>
            <button onClick={handleBack} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#FF8C00",
              display: "flex", alignItems: "center", gap: 4, marginBottom: 16,
            }}>← Change Time</button>
            <div style={{
              background: "#fff", borderRadius: 16, padding: "14px 24px",
              display: "inline-flex", alignItems: "center", gap: 10, flexWrap: "wrap",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)", marginBottom: 28,
            }}>
              <span>📅</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: "#222" }}>
                {formatDate(selectedDate)}
              </span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#888" }}>
                {formatTime(timing.startTime)} to {formatTime(timing.endTime)} · {getDurationLabel()}
              </span>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
                color: "#2ECC71", background: "#2ECC7118", padding: "3px 10px", borderRadius: 50,
              }}>{available.length} available</span>
              {promoActive && (
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
                  color: "#FF8C00", background: "#FFD70022", padding: "3px 10px", borderRadius: 50,
                }}>🎉 First rental only $50</span>
              )}
            </div>
            {timing.durationType === "multiday" && (
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#aaa", marginBottom: 16, marginTop: -16 }}>
                Showing bouncers available across all {timing.extraDays + 1} days of your rental.
              </p>
            )}

            {available.length === 0 ? (
              <div style={{
                background: "#fff", borderRadius: 24, padding: 48, textAlign: "center",
                boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
              }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>😔</div>
                <h3 style={{ fontFamily: "'Lilita One', cursive", fontSize: 24, color: "#222", marginBottom: 8 }}>All booked up!</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#888" }}>
                  Sorry, all our bouncers are reserved for this date. Try another day!
                </p>
                <button onClick={handleBack} style={{
                  marginTop: 20, background: "linear-gradient(135deg, #FFD700, #FFA500)",
                  color: "#fff", border: "none", fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700, fontSize: 16, padding: "12px 28px", borderRadius: 50, cursor: "pointer",
                }}>Pick Another Date</button>
              </div>
            ) : (
              <>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#888", marginBottom: 24 }}>
                  Tap a bouncer to reserve it for your date.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
                  {available.map((b, i) => (
                    <div key={b.id} onClick={() => handleBouncerSelect(b)}
                      style={{
                        background: "#fff", borderRadius: 20, overflow: "hidden",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.06)", cursor: "pointer",
                        transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
                        animation: `bayPopIn 0.4s ease-out ${i * 0.06}s both`,
                        border: "2px solid transparent",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.12)"; e.currentTarget.style.borderColor = b.color; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.06)"; e.currentTarget.style.borderColor = "transparent"; }}
                    >
                      <div style={{
                        height: 140, display: "flex", alignItems: "center", justifyContent: "center",
                        background: `linear-gradient(135deg, ${b.color}22, ${b.color}44)`, fontSize: 64, overflow: "hidden",
                      }}>{b.photo
                        ? <img src={b.photo} alt={b.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                        : <span>{b.img}</span>}</div>
                      <div style={{ padding: "16px 20px 20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <h3 style={{ fontFamily: "'Lilita One', cursive", fontSize: 19, color: "#222", margin: 0 }}>{b.name}</h3>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 16, color: b.color }}>
                            {promoActive ? (
                              <><span style={{ textDecoration: "line-through", color: "#ccc", fontSize: 13, fontWeight: 500, marginRight: 6 }}>${b.price}</span>$50</>
                            ) : `$${b.price}`}
                          </span>
                        </div>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888", margin: "0 0 10px", lineHeight: 1.4 }}>{b.desc}</p>
                        <div style={{ display: "flex", gap: 14, fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#999", marginBottom: 12 }}>
                          <span>📐 {b.size}</span><span>👶 {b.capacity}</span>
                        </div>
                        <div style={{
                          background: `linear-gradient(135deg, ${b.color}, ${b.color}CC)`,
                          color: "#fff", textAlign: "center", padding: "10px 0", borderRadius: 10,
                          fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14,
                        }}>Select This One →</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 4: CONTACT FORM */}
        {step === 4 && selectedBouncer && (() => {
          const { hasOutlet, ...otherChecks } = checks;
          const otherChecksOk = Object.values(otherChecks).every(Boolean);
          const outletOk = hasOutlet || form.needsGenerator;
          const formValid = form.name && form.phone && form.email && form.address && form.city && form.zip && form.surface && form.deliveryType && otherChecksOk && outletOk;

          const labelStyle = { fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 6, display: "block" };
          const checkRow = { display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12, cursor: "pointer" };
          const checkBox = (checked) => ({
            width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1,
            border: checked ? "none" : "2px solid #ddd",
            background: checked ? "linear-gradient(135deg, #FFD700, #FFA500)" : "#FAFAFA",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s ease", cursor: "pointer",
          });
          const checkText = { fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#555", lineHeight: 1.5 };
          const toggleCheck = (key) => setChecks(prev => ({ ...prev, [key]: !prev[key] }));

          return (
          <div style={{ maxWidth: 600, margin: "0 auto", animation: "bayPopIn 0.3s ease-out" }}>
            {/* Summary card */}
            <div style={{
              background: "#fff", borderRadius: 16, padding: 20, display: "flex",
              alignItems: "center", gap: 18, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", marginBottom: 24,
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
                background: `linear-gradient(135deg, ${selectedBouncer.color}22, ${selectedBouncer.color}44)`, fontSize: 36, flexShrink: 0, overflow: "hidden",
              }}>{selectedBouncer.photo
                ? <img src={selectedBouncer.photo} alt={selectedBouncer.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                : selectedBouncer.img}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: "'Lilita One', cursive", fontSize: 20, color: "#222", margin: "0 0 4px" }}>{selectedBouncer.name}</h3>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888" }}>{formatDate(selectedDate)} · {formatTime(timing.startTime)} to {formatTime(timing.endTime)}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#aaa" }}>{getDurationLabel()}</div>
              </div>
              {promoActive && (
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700,
                  color: "#2ECC71", background: "#2ECC7115", padding: "4px 10px", borderRadius: 50,
                }}>🎉 $50 deal</span>
              )}
            </div>

            <div style={{ background: "#fff", borderRadius: 24, padding: "32px 32px", boxShadow: "0 8px 40px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontFamily: "'Lilita One', cursive", fontSize: 22, color: "#222", margin: "0 0 4px" }}>Almost there!</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#888", marginBottom: 24 }}>
                Enter your details and confirm the setup requirements below.
              </p>

              {/* ── Contact Info ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Your Name *</label>
                  <input style={inputStyle} placeholder="Jane Smith" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    onFocus={e => e.target.style.borderColor = "#FFD700"} onBlur={e => e.target.style.borderColor = "#eee"} />
                </div>
                <div>
                  <label style={labelStyle}>Phone *</label>
                  <input style={inputStyle} placeholder="(831) 332-9417" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    onFocus={e => e.target.style.borderColor = "#FFD700"} onBlur={e => e.target.style.borderColor = "#eee"} />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Email *</label>
                <input style={inputStyle} placeholder="jane@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  onFocus={e => e.target.style.borderColor = "#FFD700"} onBlur={e => e.target.style.borderColor = "#eee"} />
              </div>

              {/* ── Delivery Type ── */}
              <div style={{
                borderTop: "2px solid #f5f5f5", marginTop: 8, paddingTop: 20, marginBottom: 16,
              }}>
                <div style={{ fontFamily: "'Lilita One', cursive", fontSize: 17, color: "#222", marginBottom: 6 }}>🚚 Delivery Type</div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#999", marginBottom: 14 }}>Where are we delivering to?</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    {
                      value: "home",
                      icon: "🏠",
                      label: "Home Delivery",
                      desc: "24-hour rental window. We drop off the morning of your event and pick up the next day.",
                    },
                    {
                      value: "park",
                      icon: "🌳",
                      label: "Park Delivery",
                      desc: "We arrive 1 hour before your event to set up and return 1 hour after to pick up. (+$20)",
                    },
                  ].map(dt => (
                    <div key={dt.value}
                      onClick={() => setForm({ ...form, deliveryType: dt.value })}
                      style={{
                        background: form.deliveryType === dt.value ? "#FFFDF5" : "#FAFAFA",
                        border: form.deliveryType === dt.value ? "2px solid #FFD700" : "2px solid #eee",
                        borderRadius: 14, padding: "18px 16px", cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div style={{ fontSize: 28, marginBottom: 8 }}>{dt.icon}</div>
                      <div style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700,
                        color: form.deliveryType === dt.value ? "#FF8C00" : "#333", marginBottom: 6,
                      }}>{dt.label}</div>
                      <p style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#888",
                        lineHeight: 1.5, margin: 0,
                      }}>{dt.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Delivery Address ── */}
              <div style={{
                borderTop: "2px solid #f5f5f5", marginTop: 8, paddingTop: 20, marginBottom: 16,
              }}>
                <div style={{ fontFamily: "'Lilita One', cursive", fontSize: 17, color: "#222", marginBottom: 14 }}>📍 {form.deliveryType === "park" ? "Park Location" : "Delivery Address"}</div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>{form.deliveryType === "park" ? "Park Name or Address *" : "Street Address *"}</label>
                  <input style={inputStyle} placeholder={form.deliveryType === "park" ? "Harvey West Park" : "123 Main Street"} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                    onFocus={e => e.target.style.borderColor = "#FFD700"} onBlur={e => e.target.style.borderColor = "#eee"} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>City *</label>
                    <input style={inputStyle} placeholder="Santa Cruz" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                      onFocus={e => e.target.style.borderColor = "#FFD700"} onBlur={e => e.target.style.borderColor = "#eee"} />
                  </div>
                  <div>
                    <label style={labelStyle}>ZIP *</label>
                    <input style={inputStyle} placeholder="95060" value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })}
                      onFocus={e => e.target.style.borderColor = "#FFD700"} onBlur={e => e.target.style.borderColor = "#eee"} />
                  </div>
                </div>
              </div>

              {/* ── Surface Type ── */}
              <div style={{
                borderTop: "2px solid #f5f5f5", marginTop: 8, paddingTop: 20, marginBottom: 16,
              }}>
                <div style={{ fontFamily: "'Lilita One', cursive", fontSize: 17, color: "#222", marginBottom: 6 }}>🏕️ Setup Surface</div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#999", marginBottom: 14 }}>What will the bounce house be placed on?</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
                  {[
                    { name: "Grass", surcharge: 0 },
                    { name: "Turf", surcharge: 0 },
                    { name: "Concrete", surcharge: 12, note: "sandbags" },
                    { name: "Asphalt", surcharge: 12, note: "sandbags" },
                    { name: "Dirt", surcharge: 50, note: "tarp" },
                    { name: "Bark", surcharge: 50, note: "tarp" },
                    { name: "Other", surcharge: 0 },
                  ].map(s => (
                    <button key={s.name} onClick={() => setForm({ ...form, surface: s.name })}
                      style={{
                        padding: "10px 8px", borderRadius: 12, cursor: "pointer",
                        border: form.surface === s.name ? "2px solid #FFD700" : "2px solid #eee",
                        background: form.surface === s.name ? "#FFFDF5" : "#FAFAFA",
                        fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: form.surface === s.name ? 700 : 500,
                        color: form.surface === s.name ? "#FF8C00" : "#777",
                        transition: "all 0.2s ease", textAlign: "center",
                      }}
                    >
                      {s.name}
                      {s.surcharge > 0 && (
                        <div style={{ fontSize: 11, fontWeight: 600, color: form.surface === s.name ? "#FF8C00" : "#bbb", marginTop: 2 }}>
                          +${s.surcharge} {s.note}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Party Add-Ons ── */}
              <div style={{
                borderTop: "2px solid #f5f5f5", marginTop: 8, paddingTop: 20, marginBottom: 16,
              }}>
                <div style={{ fontFamily: "'Lilita One', cursive", fontSize: 17, color: "#222", marginBottom: 6 }}>🎈 Party Add-Ons</div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#999", marginBottom: 14 }}>Make your event extra special! All items are optional.</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
                  {[
                    { id: "snowcone", icon: "🍧", name: "Snow Cone Machine", price: 75 },
                    { id: "cottoncandy", icon: "🍭", name: "Cotton Candy Machine", price: 85 },
                    { id: "canopy", icon: "/icon.png", name: "Canopy / Tent", price: 60 },
                    { id: "jenga", icon: "🧱", name: "Giant Jenga", price: 35 },
                    { id: "connect4", icon: "🔴", name: "Giant Connect 4", price: 35 },
                  ].map(item => {
                    const selected = !!form.addOns[item.id];
                    return (
                      <div key={item.id}
                        onClick={() => setForm(prev => ({
                          ...prev,
                          addOns: selected
                            ? Object.fromEntries(Object.entries(prev.addOns).filter(([k]) => k !== item.id))
                            : { ...prev.addOns, [item.id]: item.price }
                        }))}
                        style={{
                          background: selected ? "#FFFDF5" : "#FAFAFA",
                          border: selected ? "2px solid #FFD700" : "2px solid #eee",
                          borderRadius: 14, padding: "16px 14px", cursor: "pointer",
                          textAlign: "center", transition: "all 0.2s ease",
                          position: "relative",
                        }}
                      >
                        {selected && (
                          <div style={{
                            position: "absolute", top: 8, right: 8, width: 20, height: 20,
                            borderRadius: 6, background: "linear-gradient(135deg, #FFD700, #FFA500)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}><span style={{ color: "#fff", fontSize: 12, fontWeight: 800 }}>✓</span></div>
                        )}
                        <div style={{ fontSize: 32, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {item.icon.startsWith("/") ? <img src={item.icon} alt={item.name} style={{ width: 36, height: 36, objectFit: "contain" }} /> : item.icon}
                        </div>
                        <div style={{
                          fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                          fontWeight: selected ? 700 : 500,
                          color: selected ? "#222" : "#666", marginBottom: 4,
                          lineHeight: 1.3,
                        }}>{item.name}</div>
                        <div style={{
                          fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700,
                          color: selected ? "#FF8C00" : "#bbb",
                        }}>+${item.price}</div>
                      </div>
                    );
                  })}

                  {/* Table qty stepper */}
                  {[{ id: "table", icon: "🍽️", name: "Table", unitPrice: 20, qtyKey: "tableQty" },
                    { id: "chair", icon: "🪑", name: "Chair", unitPrice: 5, qtyKey: "chairQty" }
                  ].map(item => {
                    const selected = !!form.addOns[item.id];
                    const qty = form[item.qtyKey];
                    const total = qty * item.unitPrice;
                    return (
                      <div key={item.id}
                        onClick={() => !selected && setForm(prev => ({
                          ...prev,
                          addOns: { ...prev.addOns, [item.id]: prev[item.qtyKey] * item.unitPrice }
                        }))}
                        style={{
                          background: selected ? "#FFFDF5" : "#FAFAFA",
                          border: selected ? "2px solid #FFD700" : "2px solid #eee",
                          borderRadius: 14, padding: "16px 14px", cursor: selected ? "default" : "pointer",
                          textAlign: "center", transition: "all 0.2s ease", position: "relative",
                        }}
                      >
                        {selected && (
                          <div
                            onClick={e => { e.stopPropagation(); setForm(prev => ({ ...prev, addOns: Object.fromEntries(Object.entries(prev.addOns).filter(([k]) => k !== item.id)) })); }}
                            style={{
                              position: "absolute", top: 8, right: 8, width: 20, height: 20,
                              borderRadius: 6, background: "linear-gradient(135deg, #FFD700, #FFA500)",
                              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                            }}><span style={{ color: "#fff", fontSize: 12, fontWeight: 800 }}>✓</span></div>
                        )}
                        <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
                        <div style={{
                          fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                          fontWeight: selected ? 700 : 500,
                          color: selected ? "#222" : "#666", marginBottom: 6, lineHeight: 1.3,
                        }}>{item.name}</div>
                        <div style={{
                          fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700,
                          color: selected ? "#FF8C00" : "#bbb", marginBottom: selected ? 10 : 0,
                        }}>${item.unitPrice}/ea{selected ? ` = $${total}` : ""}</div>
                        {selected && (
                          <div onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                            <button
                              onClick={() => setForm(prev => {
                                const newQty = Math.max(1, prev[item.qtyKey] - 1);
                                return { ...prev, [item.qtyKey]: newQty, addOns: { ...prev.addOns, [item.id]: newQty * item.unitPrice } };
                              })}
                              style={{ width: 28, height: 28, borderRadius: 8, border: "2px solid #FFD700", background: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer", lineHeight: 1 }}
                            >−</button>
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16, minWidth: 20 }}>{qty}</span>
                            <button
                              onClick={() => setForm(prev => {
                                const newQty = prev[item.qtyKey] + 1;
                                return { ...prev, [item.qtyKey]: newQty, addOns: { ...prev.addOns, [item.id]: newQty * item.unitPrice } };
                              })}
                              style={{ width: 28, height: 28, borderRadius: 8, border: "2px solid #FFD700", background: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer", lineHeight: 1 }}
                            >+</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {Object.keys(form.addOns).length > 0 && (
                  <div style={{
                    marginTop: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#FF8C00",
                    fontWeight: 600, textAlign: "right",
                  }}>
                    {Object.keys(form.addOns).length} add-on{Object.keys(form.addOns).length > 1 ? "s" : ""} selected (+${Object.values(form.addOns).reduce((a, b) => a + b, 0)})
                  </div>
                )}
              </div>

              {/* ── Setup Checklist ── */}
              <div style={{
                borderTop: "2px solid #f5f5f5", marginTop: 8, paddingTop: 20, marginBottom: 16,
              }}>
                <div style={{ fontFamily: "'Lilita One', cursive", fontSize: 17, color: "#222", marginBottom: 6 }}>✅ Setup Checklist</div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#999", marginBottom: 16 }}>Please confirm each item to ensure a smooth delivery and setup.</p>

                <div onClick={() => toggleCheck("clearPath")} style={checkRow}>
                  <div style={checkBox(checks.clearPath)}>{checks.clearPath && <span style={{ color: "#fff", fontSize: 14, fontWeight: 800 }}>✓</span>}</div>
                  <span style={checkText}>There is a <strong>clear path at least 40 inches wide</strong> for the inflatable to be carried through to the setup area.</span>
                </div>

                <div onClick={() => toggleCheck("noSteps")} style={checkRow}>
                  <div style={checkBox(checks.noSteps)}>{checks.noSteps && <span style={{ color: "#fff", fontSize: 14, fontWeight: 800 }}>✓</span>}</div>
                  <span style={checkText}>The delivery path has <strong>no more than 2–3 steps</strong>. (Contact us if you have more steps or a steep incline.)</span>
                </div>

                <div onClick={() => toggleCheck("enoughSpace")} style={checkRow}>
                  <div style={checkBox(checks.enoughSpace)}>{checks.enoughSpace && <span style={{ color: "#fff", fontSize: 14, fontWeight: 800 }}>✓</span>}</div>
                  <span style={checkText}>I've verified there is <strong>enough space in height, width, and length</strong> for the bounce house, including at least 3 ft of clearance on all sides.</span>
                </div>

                <div onClick={() => toggleCheck("noPowerLines")} style={checkRow}>
                  <div style={checkBox(checks.noPowerLines)}>{checks.noPowerLines && <span style={{ color: "#fff", fontSize: 14, fontWeight: 800 }}>✓</span>}</div>
                  <span style={checkText}>The setup area is <strong>clear of overhead power lines, tree branches, and other obstructions</strong>.</span>
                </div>

                <div onClick={() => { toggleCheck("hasOutlet"); if (!checks.hasOutlet) setForm({ ...form, needsGenerator: false }); }} style={checkRow}>
                  <div style={checkBox(checks.hasOutlet)}>{checks.hasOutlet && <span style={{ color: "#fff", fontSize: 14, fontWeight: 800 }}>✓</span>}</div>
                  <span style={checkText}>There is a <strong>dedicated electrical outlet within 60 feet</strong> of the setup location (one outlet per bounce house).</span>
                </div>

                {!checks.hasOutlet && (
                  <div style={{
                    background: "#FFF5F5", border: "1px solid #FFCCCC", borderRadius: 12,
                    padding: "14px 18px", marginBottom: 12, marginLeft: 32,
                  }}>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#CC4444", lineHeight: 1.5, margin: "0 0 10px" }}>
                      <strong>No outlet?</strong> No worries! Add a generator rental to keep the fun going.
                    </p>
                    <div
                      onClick={() => setForm({ ...form, needsGenerator: !form.needsGenerator })}
                      style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
                    >
                      <div style={checkBox(form.needsGenerator)}>{form.needsGenerator && <span style={{ color: "#fff", fontSize: 14, fontWeight: 800 }}>✓</span>}</div>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#555" }}>
                        Add generator rental <strong style={{ color: "#FF8C00" }}>+$120</strong>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Payment Terms ── */}
              <div style={{
                borderTop: "2px solid #f5f5f5", marginTop: 8, paddingTop: 20, marginBottom: 24,
              }}>
                <div style={{ fontFamily: "'Lilita One', cursive", fontSize: 17, color: "#222", marginBottom: 6 }}>💰 Payment Terms</div>
                <div style={{
                  background: "#FFFDF5", borderRadius: 12, padding: "14px 18px", marginBottom: 14,
                  border: "1px solid #FFE88D",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#666", lineHeight: 1.7,
                }}>
                  <div style={{ marginBottom: 6 }}>• Full payment is due on delivery day and will be charged automatically unless the booking is cancelled.</div>
                  <div style={{ marginBottom: 6 }}>• Deposits are non-refundable but remain as credit toward a future booking.</div>
                  <div>• Any payments made toward the balance are also non-refundable but do not expire.</div>
                </div>
                <div onClick={() => toggleCheck("paymentTerms")} style={{ ...checkRow, marginBottom: 0 }}>
                  <div style={checkBox(checks.paymentTerms)}>{checks.paymentTerms && <span style={{ color: "#fff", fontSize: 14, fontWeight: 800 }}>✓</span>}</div>
                  <span style={{ ...checkText, fontWeight: 600 }}>I have read and agree to the payment terms above.</span>
                </div>
              </div>

              {/* ── Order Total ── */}
              <div style={{
                borderTop: "2px solid #f5f5f5", marginTop: 8, paddingTop: 20, marginBottom: 16,
              }}>
                <div style={{ fontFamily: "'Lilita One', cursive", fontSize: 17, color: "#222", marginBottom: 14 }}>🧾 Order Summary</div>
                {promoActive && (
                  <div style={{
                    background: "#2ECC7115", border: "1px solid #2ECC7133", borderRadius: 10,
                    padding: "8px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8,
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#2ECC71", fontWeight: 600,
                  }}>🎉 First-time deal applied! Rental only $50</div>
                )}
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "#666" }}>
                    <span>Bounce house rental{promoActive ? " (day 1)" : ""}</span>
                    {promoActive ? (
                      <span style={{ fontWeight: 600 }}>
                        <span style={{ textDecoration: "line-through", color: "#ccc", marginRight: 8 }}>${selectedBouncer.price}.00</span>
                        <span style={{ color: "#2ECC71", fontWeight: 800 }}>$50.00</span>
                      </span>
                    ) : (
                      <span style={{ fontWeight: 600, color: "#222" }}>${selectedBouncer.price}.00</span>
                    )}
                  </div>
                  {timing.durationType === "overnight" && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "#666" }}>
                      <span>🌙 Overnight fee</span>
                      <span style={{ fontWeight: 600, color: "#222" }}>$50.00</span>
                    </div>
                  )}
                  {timing.durationType === "multiday" && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "#666" }}>
                      <span>📆 Extra {timing.extraDays} day{timing.extraDays > 1 ? "s" : ""} (50% of ${selectedBouncer.price}/day)</span>
                      <span style={{ fontWeight: 600, color: "#222" }}>${Math.round(selectedBouncer.price * 0.5) * timing.extraDays}.00</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "#666" }}>
                    <span>Delivery, setup & pickup</span>
                    <span style={{ fontWeight: 600, color: "#222" }}>$60.00</span>
                  </div>
                  {form.deliveryType === "park" && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "#666" }}>
                      <span>Park delivery surcharge</span>
                      <span style={{ fontWeight: 600, color: "#222" }}>$20.00</span>
                    </div>
                  )}
                  {form.needsGenerator && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "#666" }}>
                      <span>⚡ Generator rental</span>
                      <span style={{ fontWeight: 600, color: "#222" }}>$120.00</span>
                    </div>
                  )}
                  {["Concrete", "Asphalt"].includes(form.surface) && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "#666" }}>
                      <span>🧱 Sandbag anchoring ({form.surface})</span>
                      <span style={{ fontWeight: 600, color: "#222" }}>$12.00</span>
                    </div>
                  )}
                  {["Dirt", "Bark"].includes(form.surface) && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "#666" }}>
                      <span>🛡️ Protective tarp ({form.surface})</span>
                      <span style={{ fontWeight: 600, color: "#222" }}>$50.00</span>
                    </div>
                  )}
                  {Object.keys(form.addOns).length > 0 && (() => {
                    const addOnNames = {
                      snowcone: "🍧 Snow Cone Machine", cottoncandy: "🍭 Cotton Candy Machine",
                      table: `🍽️ Tables ×${form.tableQty}`, chair: `🪑 Chairs ×${form.chairQty}`,
                      canopy: "Canopy / Tent",
                      jenga: "🧱 Giant Jenga", connect4: "🔴 Giant Connect 4",
                    };
                    return Object.entries(form.addOns).map(([id, price]) => (
                      <div key={id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "#666" }}>
                        <span>{addOnNames[id] || id}</span>
                        <span style={{ fontWeight: 600, color: "#222" }}>${price}.00</span>
                      </div>
                    ));
                  })()}

                  {/* Damage Waiver */}
                  <div style={{
                    background: "#FAFAFA", borderRadius: 12, padding: "14px 16px", marginBottom: 14,
                  }}>
                    <div
                      onClick={() => setForm({ ...form, damageWaiver: !form.damageWaiver })}
                      style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}
                    >
                      <div style={{
                        width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1,
                        border: form.damageWaiver ? "none" : "2px solid #ddd",
                        background: form.damageWaiver ? "linear-gradient(135deg, #FFD700, #FFA500)" : "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s ease",
                      }}>{form.damageWaiver && <span style={{ color: "#fff", fontSize: 14, fontWeight: 800 }}>✓</span>}</div>
                      <div>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#555" }}>
                          🛡️ Damage Waiver <span style={{ color: "#FF8C00", fontWeight: 700 }}>+10%</span> <span style={{ fontSize: 12, color: "#bbb" }}>(optional)</span>
                        </span>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#999", margin: "4px 0 0", lineHeight: 1.4 }}>
                          Covers accidental damage to the inflatable during your rental. Based on the full rental value. Without this waiver, you are responsible for repair or replacement costs.
                        </p>
                      </div>
                    </div>
                    {form.damageWaiver && (() => {
                      const waiverAmt = selectedBouncer.price * 0.10;
                      return (
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "#FF8C00" }}>
                          +${waiverAmt.toFixed(2)}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Tip */}
                  <div style={{
                    background: "#FAFAFA", borderRadius: 12, padding: "14px 16px", marginBottom: 14,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ color: "#666", fontSize: 14 }}>💛 Tip for your delivery crew <span style={{ fontSize: 12, color: "#bbb" }}>(optional)</span></span>
                      {form.tipPercent > 0 && (
                        <span style={{ fontWeight: 700, color: "#FF8C00", fontSize: 14 }}>
                          ${(60 * form.tipPercent / 100).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[0, 10, 15, 20, 25].map(pct => (
                        <button key={pct} onClick={() => setForm({ ...form, tipPercent: pct })}
                          style={{
                            flex: 1, padding: "8px 0", borderRadius: 8, cursor: "pointer",
                            border: form.tipPercent === pct ? "2px solid #FFD700" : "2px solid #eee",
                            background: form.tipPercent === pct ? "#FFFDF5" : "#fff",
                            fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                            fontWeight: form.tipPercent === pct ? 700 : 500,
                            color: form.tipPercent === pct ? "#FF8C00" : "#888",
                            transition: "all 0.2s",
                          }}
                        >{pct === 0 ? "None" : `${pct}%`}</button>
                      ))}
                    </div>
                    {form.tipPercent > 0 && (
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#bbb", marginTop: 8, marginBottom: 0 }}>
                        Based on $60 deposit. Thank you for your generosity!
                      </p>
                    )}
                  </div>

                  <div style={{ borderTop: "2px solid #FFE88D", paddingTop: 12, display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontWeight: 800, color: "#222", fontSize: 16 }}>Total</span>
                    <span style={{ fontWeight: 800, color: "#FF8C00", fontSize: 22 }}>
                      ${(() => {
                        const rental = promoActive ? 50 : selectedBouncer.price;
                        const extra = getExtraCost(selectedBouncer.price);
                        const delivery = 60;
                        const park = form.deliveryType === "park" ? 20 : 0;
                        const generator = form.needsGenerator ? 120 : 0;
                        const surfaceFee = ["Concrete","Asphalt"].includes(form.surface) ? 12 : ["Dirt","Bark"].includes(form.surface) ? 50 : 0;
                        const addOnsTotal = Object.values(form.addOns).reduce((a, b) => a + b, 0);
                        const waiver = form.damageWaiver ? selectedBouncer.price * 0.10 : 0;
                        const tip = 60 * form.tipPercent / 100;
                        return (rental + extra + delivery + park + generator + surfaceFee + addOnsTotal + waiver + tip).toFixed(2);
                      })()}
                    </span>
                  </div>

                  {/* Due breakdown */}
                  <div style={{
                    background: "linear-gradient(135deg, #FF8C0010, #FFD70015)", borderRadius: 12,
                    padding: "16px 18px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 800, color: "#222" }}>Due now (non-refundable deposit)</div>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#999" }}>Secures your booking. Remains as credit if cancelled.</div>
                      </div>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 800, color: "#FF8C00" }}>$60.00</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#888" }}>Balance due on delivery day</div>
                      </div>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700, color: "#888" }}>
                        ${(() => {
                          const rental = promoActive ? 50 : selectedBouncer.price;
                          const extra = getExtraCost(selectedBouncer.price);
                          const delivery = 60;
                          const park = form.deliveryType === "park" ? 20 : 0;
                          const generator = form.needsGenerator ? 120 : 0;
                          const surfaceFee = ["Concrete","Asphalt"].includes(form.surface) ? 12 : ["Dirt","Bark"].includes(form.surface) ? 50 : 0;
                          const addOnsTotal = Object.values(form.addOns).reduce((a, b) => a + b, 0);
                          const waiver = form.damageWaiver ? selectedBouncer.price * 0.10 : 0;
                          const tip = 60 * form.tipPercent / 100;
                          const total = rental + extra + delivery + park + generator + surfaceFee + addOnsTotal + waiver + tip;
                          return (total - 60).toFixed(2);
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Notes ── */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Anything else? (optional)</label>
                <textarea rows={3} style={{ ...inputStyle, resize: "vertical" }} placeholder="Event start/end time, special requests, gate codes…"
                  value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  onFocus={e => e.target.style.borderColor = "#FFD700"} onBlur={e => e.target.style.borderColor = "#eee"} />
              </div>

              {/* ── Submit ── */}
              {checkoutError && (
                <div style={{
                  background: "#FFF0F0", border: "1px solid #FFCCCC", borderRadius: 12,
                  padding: "12px 16px", marginBottom: 14,
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#CC4444",
                }}>
                  {checkoutError}
                </div>
              )}
              {!formValid && (
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#ccc", textAlign: "center", marginBottom: 12 }}>
                  Please fill in all required fields, select a delivery type, confirm all checklist items (or add a generator if no outlet), and agree to payment terms.
                </p>
              )}
              <button onClick={handleSubmit}
                disabled={!formValid || submitting}
                style={{
                  width: "100%",
                  background: formValid && !submitting ? "linear-gradient(135deg, #FFD700, #FFA500)" : "#e5e5e5",
                  color: formValid && !submitting ? "#fff" : "#aaa",
                  border: "none", fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 800, fontSize: 18, padding: "16px 0", borderRadius: 14,
                  cursor: formValid && !submitting ? "pointer" : "not-allowed",
                  boxShadow: formValid && !submitting ? "0 6px 24px rgba(255,165,0,0.3)" : "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { if (formValid && !submitting) e.target.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.target.style.transform = "none"; }}
              >{submitting ? "Processing..." : "Pay $60 Deposit & Reserve 🎉"}</button>

              <div style={{ textAlign: "center", margin: "16px 0 8px" }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#ccc" }}>or</span>
              </div>

              <button onClick={handleCashBooking}
                disabled={!formValid || submitting}
                style={{
                  width: "100%",
                  background: formValid && !submitting ? "#f5f5f5" : "#fafafa",
                  color: formValid && !submitting ? "#666" : "#ccc",
                  border: "2px solid #eee",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700, fontSize: 15, padding: "14px 0", borderRadius: 14,
                  cursor: formValid && !submitting ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { if (formValid && !submitting) e.target.style.borderColor = "#FFD700"; }}
                onMouseLeave={e => { e.target.style.borderColor = "#eee"; }}
              >{submitting ? "Processing..." : "💵 Reserve & Pay Cash on Delivery"}</button>

              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#bbb", textAlign: "center", marginTop: 12 }}>
                Card payments process a $60 non-refundable deposit. Cash bookings are confirmed by our team within 24 hours.
              </p>
            </div>
          </div>
          );
        })()}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: "#1A1A1A", padding: "48px 24px 32px", textAlign: "center" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: 28 }}>🎪</span>
          <span style={{
            fontFamily: "'Lilita One', cursive", fontSize: 24, fontWeight: 800,
            background: "linear-gradient(135deg, #FFD700, #FF8C00)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>BayBouncers</span>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#666", lineHeight: 1.6, maxWidth: 400, margin: "0 auto 24px" }}>
          Delivering affordable bounce house rentals to Watsonville, Aptos, Capitola, Soquel, Santa Cruz, Scotts Valley, Gilroy, Morgan Hill, Campbell, Los Gatos, and San Jose.
        </p>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 28, fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#888" }}>
          <span>📞 (831) 332-9417</span>
          <span>📧 hellobaybouncers@gmail.com</span>
        </div>
        <BouncingDots />
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#555", marginTop: 16 }}>
          © 2026 BayBouncers. All rights reserved. Bounce responsibly. 🎈
        </p>
      </div>
    </footer>
  );
}

export default function BayBouncers() {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [promoActive, setPromoActive] = useState(false);
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        @keyframes bayBounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-12px); }
        }
        @keyframes bayFloat {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes bayPopIn {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        ::selection { background: #FFD700; color: #fff; }
      `}</style>
      <PromoBanner onNavigate={scrollTo} visible={bannerVisible} onDismiss={() => setBannerVisible(false)} onActivatePromo={() => setPromoActive(true)} />
      <Navbar onNavigate={scrollTo} bannerVisible={bannerVisible} />
      <Hero onNavigate={scrollTo} />
      <Inventory onNavigate={scrollTo} />
      <HowItWorks />
      <Pricing />
      <ServiceArea />
      <FAQ />
      <BookingWizard promoActive={promoActive} />
      <Footer />
    </div>
  );
}