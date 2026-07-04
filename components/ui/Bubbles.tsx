import React, { useMemo } from "react";

/* ---- hoisted static styles (perf: avoid re-allocating on every render) ---- */
const __style1 = { position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" } as const;


export function Bubbles({ count = 14 }) {
  const bubbles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 4 + Math.random() * 10,
        duration: 8 + Math.random() * 10,
        delay: Math.random() * 10,
      })),
    [count]
  );
  return (
    <div style={__style1}>
      {bubbles.map((b) => (
        <span
          key={b.id}
          style={{
            position: "absolute",
            left: `${b.left}%`,
            bottom: "-20px",
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            background: "rgba(0,201,177,0.18)",
            border: "1px solid rgba(0,201,177,0.35)",
            animation: `floatUp ${b.duration}s linear ${b.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(-110vh) translateX(20px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ---------- Toast ---------- */
