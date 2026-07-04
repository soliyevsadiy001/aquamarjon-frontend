import React from "react";
import { diaryUrgency } from "../../lib/diary-stats";
import { Dp } from "../../lib/doctor-styles";

/* ---- hoisted static styles (perf: avoid re-allocating on every render) ---- */
const __style1 = { marginBottom: 10 } as const;
const __style2 = { display: "flex", justifyContent: "space-between", fontSize: 11.5, color: Dp.soft, marginBottom: 4 } as const;
const __style3 = { height: 5, background: Dp.border, borderRadius: 999, overflow: "hidden" } as const;


export function UrgencyBar({ daysAgo, interval, label }) {
  const pct = Math.min(daysAgo / interval, 1);
  const urg = diaryUrgency(daysAgo, interval);
  const color = urg === "overdue" ? Dp.danger : urg === "soon" ? Dp.amber : Dp.teal;
  return (
    <div style={__style1}>
      <div style={__style2}>
        <span>{label}</span>
        <span style={{ color: urg !== "ok" ? color : Dp.muted }}>
          {urg === "overdue" ? "⚠️ Просрочено!" : urg === "soon" ? "Скоро!" : `${interval - daysAgo} дн. осталось`}
        </span>
      </div>
      <div style={__style3}>
        <div style={{ height: "100%", width: `${pct * 100}%`, background: color, borderRadius: 999, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

