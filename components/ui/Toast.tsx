import React from "react";
import { COLORS } from "../../theme";

export function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 84,
        left: "50%",
        transform: "translateX(-50%)",
        background: toast.type === "bad" ? "#3A1414" : COLORS.greenBg,
        border: `1px solid ${toast.type === "bad" ? COLORS.red : COLORS.teal}`,
        color: COLORS.text,
        padding: "10px 16px",
        borderRadius: 12,
        fontSize: 14,
        zIndex: 200,
        maxWidth: "88%",
        textAlign: "center",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        animation: "toastIn 0.25s ease-out",
      }}
    >
      {toast.text}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   🏠 ЛЕНДИНГ — главная страница AquaMarjon
   ============================================================ */
