import { COLORS } from "../theme";

export const primaryBtn = {
  width: "100%",
  background: COLORS.teal,
  color: COLORS.bg,
  border: "none",
  borderRadius: 12,
  padding: "13px",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
};

export const disabledBtn = { ...primaryBtn, background: COLORS.border, color: COLORS.muted, cursor: "default" };

export const ghostBtn = {
  width: "100%",
  background: "none",
  color: COLORS.soft,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 12,
  padding: "12px",
  fontSize: 14,
  cursor: "pointer",
};

/* ---------- Client Profile (мои аквариумы, заказы, избранное) ---------- */

export const S = {
  bg: COLORS.bg, card: COLORS.card, border: COLORS.border,
  teal: COLORS.teal, amber: COLORS.amber, text: COLORS.text,
  muted: COLORS.muted, soft: COLORS.soft, red: COLORS.red,
  success: COLORS.green, successBg: COLORS.greenBg,
};

