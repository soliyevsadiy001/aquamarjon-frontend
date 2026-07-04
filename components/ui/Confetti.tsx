import React, { useMemo } from "react";
import { COLORS } from "../../theme";

/* ---- hoisted static styles (perf: avoid re-allocating on every render) ---- */
const __style1 = { position: "fixed", inset: 0, zIndex: 650, pointerEvents: "none", overflow: "hidden" } as const;


export function Confetti({ active, colors }) {
  const pieces = useMemo(() => {
    if (!active) return [];
    const palette = colors && colors.length ? colors : [COLORS.teal, COLORS.amber, "#FFD24A", COLORS.green, COLORS.red, COLORS.soft];
    return Array.from({ length: 26 }, (_, i) => ({
      id: i,
      left: 5 + Math.random() * 90,
      delay: Math.random() * 0.25,
      duration: 1.1 + Math.random() * 0.7,
      size: 6 + Math.random() * 6,
      color: palette[i % palette.length],
      rotate: Math.round(Math.random() * 360),
      drift: Math.round((Math.random() - 0.5) * 120),
      round: Math.random() > 0.5,
    }));
  }, [active, colors]);

  if (!active) return null;

  return (
    <>
      <style>{`
        @keyframes aquaConfettiFall {
          0%   { transform: translate(0,0) rotate(0deg); opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translate(var(--drift), 160px) rotate(420deg); opacity: 0; }
        }
      `}</style>
      <div style={__style1}>
        {pieces.map(p => (
          <span
            key={p.id}
            style={{
              position: "absolute", top: "18%", left: `${p.left}%`,
              width: p.size, height: p.size * (p.round ? 1 : 1.6),
              background: p.color, borderRadius: p.round ? "50%" : 2,
              ["--drift" as any]: `${p.drift}px`,
              animation: `aquaConfettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
              transform: `rotate(${p.rotate}deg)`,
            }}
          />
        ))}
      </div>
    </>
  );
}

