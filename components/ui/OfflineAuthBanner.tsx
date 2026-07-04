import React from "react";
import { ALLOW_OFFLINE_AUTH_FALLBACK } from "../../lib/api";

// Видимый баннер поверх интерфейса, пока включён офлайн-фолбэк логина
// (см. ALLOW_OFFLINE_AUTH_FALLBACK в lib/api.ts). Цель — сделать риск
// физически заметным на глаз в QA/на демо-стенде, а не только в консоли:
// баннер про console.warn легко пропустить, а эту красную полоску сверху
// экрана — нет. В нормальной production-сборке (`vite build` без явного
// VITE_ALLOW_OFFLINE_AUTH_FALLBACK=true) компонент рендерит `null`.
export function OfflineAuthBanner() {
  if (!ALLOW_OFFLINE_AUTH_FALLBACK) return null;

  return (
    <div
      role="alert"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        background: "#FF6B6B",
        color: "#2A1414",
        fontSize: 11,
        fontWeight: 800,
        textAlign: "center",
        padding: "4px 8px",
        letterSpacing: 0.2,
      }}
    >
      ⚠️ OFFLINE AUTH FALLBACK включён — пароли из data/accounts.ts в бандле. Не деплоить так в прод.
    </div>
  );
}
