import React from "react";
import { COLORS } from "../../theme";
import { ADMIN_SC } from "../../data/admin-seed";
import { A } from "../../lib/admin-styles";

/* ---- hoisted static styles (perf: avoid re-allocating on every render) ---- */
const __style1 = { background: COLORS.panel, border: `1px solid ${A.border}`, borderRadius: 10, padding: "9px 12px", color: A.text, fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" } as const;


export function AdminToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 999, background: value ? A.teal : COLORS.border, position: "relative", cursor: "pointer", flexShrink: 0, transition: "background 0.2s" }}>
      <div style={{ position: "absolute", top: 3, left: value ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: COLORS.text, transition: "left 0.2s" }} />
    </div>
  );
}

// ── Маленький бейдж статуса ───────────────────────────────────

export const StatusBadge = React.memo(function StatusBadge({ status }: { status: string }) {
  const s = ADMIN_SC[status] || ADMIN_SC.accepted;
  return <span style={{ fontSize: 11, background: s.bg, color: s.color, borderRadius: 999, padding: "2px 9px", fontWeight: 700, whiteSpace: "nowrap" }}>{s.label}</span>;
});

// ── Inline input ──────────────────────────────────────────────

export interface AInpProps {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}

export function AInp({ value, onChange, type = "text", placeholder = "" }: AInpProps) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={__style1} />
  );
}

// ── Главный компонент ─────────────────────────────────────────
