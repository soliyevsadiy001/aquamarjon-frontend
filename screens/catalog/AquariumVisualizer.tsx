import React, { useMemo, useState } from "react";
import { COLORS } from "../../theme";
import { AppleEmoji } from "../../components/ui/AppleEmoji";
import { Sticker } from "../../components/ui/Sticker";
import { checkCompatibility } from "../../lib/catalog-utils";

/* ---- hoisted static styles (perf: avoid re-allocating on every render) ---- */
const __style1 = { fontSize: 22 } as const;
const __style2 = { flex: 1 } as const;
const __style3 = { fontSize: 13, fontWeight: 700 } as const;
const __style4 = { color: COLORS.muted, fontSize: 16 } as const;
const __style5 = {
          position: "fixed", inset: 0, background: "rgba(5,10,16,0.85)",
          zIndex: 160, display: "flex", alignItems: "flex-end",
        } as const;
const __style6 = {
            background: COLORS.bg2, width: "100%", maxHeight: "80vh",
            borderRadius: "20px 20px 0 0", padding: "20px 18px 32px",
            overflowY: "auto", color: COLORS.text,
          } as const;
const __style7 = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } as const;
const __style8 = { fontSize: 16, fontWeight: 800 } as const;
const __style9 = { background: "none", border: "none", color: COLORS.muted, fontSize: 20, cursor: "pointer" } as const;
const __style10 = {
              background: "linear-gradient(180deg, #051828 0%, #071E2A 100%)",
              border: `2px solid ${COLORS.border}`, borderRadius: 16,
              padding: 20, marginBottom: 20, position: "relative",
              minHeight: 160,
            } as const;
const __style11 = { display: "flex", justifyContent: "space-around", alignItems: "center", flexWrap: "wrap", gap: 12, position: "relative", zIndex: 1 } as const;
const __style12 = { textAlign: "center" } as const;
const __style13 = { fontSize: 9, color: COLORS.soft, maxWidth: 60, lineHeight: 1.2 } as const;
const __style14 = { fontSize: 12, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 } as const;
const __style15 = { fontSize: 11.5, fontWeight: 600 } as const;
const __style16 = { fontSize: 11, color: COLORS.muted, marginTop: 1 } as const;


export function AquariumVisualizer({ cart, allFish }) {
  const [open, setOpen] = useState(false);
  const fishInCart = useMemo(() => {
    const seen = {};
    return cart.filter(f => f.type === "fish").filter(f => {
      if (seen[f.id]) return false;
      seen[f.id] = true;
      return true;
    });
  }, [cart]);

  if (fishInCart.length < 2) return null;

  // Compute all pairs
  const pairs = [];
  for (let i = 0; i < fishInCart.length; i++) {
    for (let j = i + 1; j < fishInCart.length; j++) {
      const a = fishInCart[i], b = fishInCart[j];
      const compat = checkCompatibility(a, [b]);
      pairs.push({ a, b, level: compat.level, reason: compat.reason });
    }
  }

  const badCount = pairs.filter(p => p.level === "bad").length;
  const warnCount = pairs.filter(p => p.level === "warn").length;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          width: "100%",
          marginBottom: 12,
          display: "flex", alignItems: "center", gap: 10,
          background: badCount > 0 ? "linear-gradient(90deg, #2A1010, #102433)"
            : warnCount > 0 ? "linear-gradient(90deg, #1E1A08, #102433)"
            : "linear-gradient(90deg, #071C14, #102433)",
          border: `1px solid ${badCount > 0 ? COLORS.red : warnCount > 0 ? COLORS.amber : COLORS.teal}`,
          borderRadius: 14, padding: "11px 14px",
          color: COLORS.text, cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={__style1}>🗺️</span>
        <span style={__style2}>
          <div style={__style3}>
            Карта аквариума · {fishInCart.length} вид{fishInCart.length > 1 ? "а" : ""}
          </div>
          <div style={{ fontSize: 11, color: badCount > 0 ? COLORS.red : warnCount > 0 ? COLORS.amber : COLORS.teal, marginTop: 1 }}>
            {badCount > 0 ? `⚠️ ${badCount} конфликт${badCount > 1 ? "а" : ""}` : warnCount > 0 ? `🟡 ${warnCount} предупреждение` : "✅ Все совместимы — отличный аквариум!"}
          </div>
        </span>
        <span style={__style4}>→</span>
      </button>

      {open && (
        <div style={__style5} onClick={() => setOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={__style6}>
            <div style={__style7}>
              <div style={__style8}>🗺️ Карта совместимости</div>
              <button onClick={() => setOpen(false)} style={__style9} aria-label="Закрыть">✕</button>
            </div>

            {/* Аквариум-схема */}
            <div style={__style10}>
              {/* Пузырики */}
              {[20,45,70].map(l => (
                <div key={l} style={{
                  position: "absolute", bottom: 10, left: `${l}%`,
                  width: 6, height: 6, borderRadius: "50%",
                  background: "rgba(0,201,177,0.2)", border: "1px solid rgba(0,201,177,0.4)",
                  animation: "floatUp 4s linear infinite",
                  animationDelay: `${l/40}s`,
                }} />
              ))}
              {/* Рыбы в ряд */}
              <div style={__style11}>
                {fishInCart.map((fish, idx) => {
                  const hasConflict = pairs.some(p => (p.a.id === fish.id || p.b.id === fish.id) && p.level === "bad");
                  const hasWarn = !hasConflict && pairs.some(p => (p.a.id === fish.id || p.b.id === fish.id) && p.level === "warn");
                  return (
                    <div key={fish.id} style={__style12}>
                      <div style={{
                        width: 56, height: 56, borderRadius: "50%",
                        background: `radial-gradient(circle, ${fish.color}33, ${fish.color}11)`,
                        border: `2px solid ${hasConflict ? COLORS.red : hasWarn ? COLORS.amber : COLORS.teal}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 4px",
                        boxShadow: `0 0 12px ${hasConflict ? "#FF6B6B44" : hasWarn ? "#F0A93C44" : "#00C9B144"}`,
                      }}><AppleEmoji e={fish.img} size={30} /></div>
                      <div style={__style13}>
                        {fish.name.split(" ")[0]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Пары */}
            <div style={__style14}>
              Совместимость пар
            </div>
            {pairs.map((p, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: p.level === "bad" ? "#1A0A0A" : p.level === "warn" ? "#1A1500" : COLORS.greenBg2,
                border: `1px solid ${p.level === "bad" ? "#FF6B6B33" : p.level === "warn" ? "#F0A93C33" : "#00C9B133"}`,
                borderRadius: 10, padding: "10px 12px", marginBottom: 8,
              }}>
                <Sticker e={p.a.img} size={32} />
                <span style={{ fontSize: 14, color: p.level === "bad" ? COLORS.red : p.level === "warn" ? COLORS.amber : COLORS.teal }}>
                  {p.level === "bad" ? "✗" : p.level === "warn" ? "〜" : "✓"}
                </span>
                <Sticker e={p.b.img} size={32} />
                <div style={__style2}>
                  <div style={__style15}>
                    {p.a.name.split(" ")[0]} + {p.b.name.split(" ")[0]}
                  </div>
                  <div style={__style16}>
                    {p.level === "bad" ? p.reason : p.level === "warn" ? p.reason : "Отлично уживутся вместе"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ============================================================
   WOW-ФИЧА 2: Сравнение рыб — модальное окно таблицы
   ============================================================ */
