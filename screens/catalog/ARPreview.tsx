import React, { useEffect, useState } from "react";
import { COLORS } from "../../theme";
import { AppleEmoji } from "../../components/ui/AppleEmoji";
import { formatSum } from "../../lib/catalog-utils";

/* ---- hoisted static styles (perf: avoid re-allocating on every render) ---- */
const __style1 = {
      position: "fixed", inset: 0, zIndex: 180,
      background: "#000", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      color: COLORS.text, fontFamily: "system-ui, sans-serif",
    } as const;
const __style2 = {
            position: "absolute", inset: 0,
            background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,201,177,0.04) 3px, rgba(0,201,177,0.04) 4px)",
            animation: "scanMove 2s linear infinite",
          } as const;
const __style3 = {
            position: "absolute", bottom: 0, left: 0, right: 0, height: "30%",
            background: "linear-gradient(180deg, transparent, rgba(0,60,40,0.5))",
          } as const;
const __style4 = { position: "relative", zIndex: 1, width: "100%", padding: "0 20px", boxSizing: "border-box" } as const;
const __style5 = {
          position: "fixed", top: 0, left: 0, right: 0,
          padding: "16px 20px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "linear-gradient(180deg, rgba(0,0,0,0.6), transparent)",
        } as const;
const __style6 = { fontSize: 13, fontWeight: 700, color: COLORS.teal } as const;
const __style7 = {
            background: "rgba(0,0,0,0.5)", border: `1px solid ${COLORS.border}`,
            borderRadius: 999, width: 32, height: 32,
            color: COLORS.text, fontSize: 16, cursor: "pointer",
          } as const;
const __style8 = {
            position: "fixed", bottom: 0, left: 0, right: 0,
            background: "linear-gradient(0deg, rgba(8,19,31,0.95), transparent)",
            padding: "32px 20px 28px",
          } as const;
const __style9 = { fontSize: 17, fontWeight: 800, marginBottom: 4 } as const;
const __style10 = { fontSize: 12, color: COLORS.soft, marginBottom: 14 } as const;
const __style11 = {
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "rgba(14,32,48,0.9)", border: `1px solid ${COLORS.border}`,
              borderRadius: 14, padding: "10px 14px",
            } as const;
const __style12 = { fontSize: 16, fontWeight: 800, color: COLORS.amber } as const;
const __style13 = {
                background: COLORS.teal, color: COLORS.bg,
                border: "none", borderRadius: 10, padding: "8px 18px",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
              } as const;
const __style14 = { fontSize: 10, color: COLORS.muted, textAlign: "center", marginTop: 10 } as const;


export function ARPreview({ fish, onClose }) {
  const [phase, setPhase] = useState("scanning"); // scanning | live
  useEffect(() => {
    const t = setTimeout(() => setPhase("live"), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={__style1}>
      {/* Simulated camera feed */}
      <div style={{
        position: "absolute", inset: 0,
        background: phase === "scanning"
          ? "linear-gradient(135deg, #0a1a0a 0%, #051010 100%)"
          : "linear-gradient(180deg, #0d2010 0%, #061408 40%, #081c10 100%)",
        transition: "background 0.8s",
      }}>
        {/* Scan lines */}
        {phase === "scanning" && (
          <div style={__style2} />
        )}
        {/* Corner brackets */}
        {[
          { top: 40, left: 40 }, { top: 40, right: 40 },
          { bottom: 40, left: 40 }, { bottom: 40, right: 40 },
        ].map((pos, i) => (
          <div key={i} style={{
            position: "absolute", ...pos,
            width: 28, height: 28,
            borderTop: i < 2 ? `2px solid ${COLORS.teal}` : "none",
            borderBottom: i >= 2 ? `2px solid ${COLORS.teal}` : "none",
            borderLeft: i % 2 === 0 ? `2px solid ${COLORS.teal}` : "none",
            borderRight: i % 2 === 1 ? `2px solid ${COLORS.teal}` : "none",
          }} />
        ))}
        {/* Animated fish */}
        {phase === "live" && (
          <div style={{
            position: "absolute",
            top: "38%", left: "50%",
            transform: "translate(-50%, -50%)",
            filter: "drop-shadow(0 0 20px " + fish.color + "88)",
            animation: "arSwim 3s ease-in-out infinite",
          }}><AppleEmoji e={fish.img} size={110} /></div>
        )}
        {/* Water ripple */}
        {phase === "live" && (
          <div style={__style3} />
        )}
      </div>

      {/* Overlay UI */}
      <div style={__style4}>
        {/* Top bar */}
        <div style={__style5}>
          <div style={__style6}>
            {phase === "scanning" ? "🔍 Сканирование аквариума..." : "✅ Рыба в вашем аквариуме"}
          </div>
          <button onClick={onClose} aria-label="Закрыть" style={__style7}>✕</button>
        </div>

        {/* Bottom info */}
        {phase === "live" && (
          <div style={__style8}>
            <div style={__style9}>{fish.name}</div>
            <div style={__style10}>{fish.about.slice(0, 80)}...</div>
            <div style={__style11}>
              <span style={__style12}>{formatSum(fish.price)}</span>
              <button onClick={onClose} style={__style13}>Хочу такую →</button>
            </div>
            <div style={__style14}>
              📸 Демо-режим · Реальный AR будет в следующем обновлении
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes arSwim {
          0%, 100% { transform: translate(-50%, -50%) scaleX(1) translateX(0); }
          30% { transform: translate(-50%, -50%) scaleX(1) translateX(18px) translateY(-6px); }
          60% { transform: translate(-50%, -50%) scaleX(-1) translateX(8px); }
          80% { transform: translate(-50%, -50%) scaleX(-1) translateX(-12px) translateY(4px); }
        }
        @keyframes scanMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(8px); }
        }
      `}</style>
    </div>
  );
}

/* ---------- Fish card (grid) ---------- */
