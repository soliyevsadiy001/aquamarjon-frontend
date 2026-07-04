import React, { useState } from "react";
import { COLORS, THEME } from "../../theme";
import { AppleEmoji } from "../../components/ui/AppleEmoji";
import { submitSupportRequest, tgUser } from "../../lib/api";

/* ---- hoisted static styles (perf: avoid re-allocating on every render) ---- */
const __style1 = { fontSize: 60, marginBottom: 20 } as const;
const __style2 = { fontSize: 22, fontWeight: 900, marginBottom: 12 } as const;
const __style3 = { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "32px 24px" } as const;
const __style4 = { textAlign: "center", marginBottom: 36 } as const;
const __style5 = { marginBottom: 8, display: "flex", justifyContent: "center" } as const;
const __style6 = { fontSize: 22, fontWeight: 900 } as const;
const __style7 = { maxWidth: 360, width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 } as const;
const __style8 = {
              display: "flex", alignItems: "center", gap: 14,
              background: "linear-gradient(135deg, #229ED9, #1A7BBD)",
              borderRadius: 16, padding: "16px 20px", textDecoration: "none",
              boxShadow: "0 6px 24px #229ED944",
            } as const;
const __style9 = { fontSize: 28 } as const;
const __style10 = { fontSize: 15, fontWeight: 800, color: "#fff" } as const;
const __style11 = { fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 } as const;
const __style12 = { textAlign: "left" } as const;
const __style13 = { fontSize: 15, fontWeight: 800, color: COLORS.bg } as const;
const __style14 = { fontSize: 12, color: COLORS.bg, opacity: 0.7, marginTop: 2 } as const;


export function ContactSupportScreen({ role, onBack }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const C = THEME;
  const roleLabel = role === "courier" ? "курьера" : "продавца";
  const roleIcon  = role === "courier" ? "🏍️" : "🏪";
  const TG_SUPPORT = "https://t.me/aquauz_support";
  // chat_id администратора теперь конфигурируется на бэкенде (рядом с токеном
  // бота), а не хардкодится тут — фронту это знать не нужно.

  async function handleCallRequest() {
    setSubmitting(true);
    try {
      const tgUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
      const name = tgUser ? `${tgUser.first_name || ""} ${tgUser.last_name || ""}`.trim() : "Неизвестный";
      const username = tgUser?.username ? `@${tgUser.username}` : "(без username)";
      const userId = tgUser?.id || "—";
      // Раньше здесь был прямой fetch на api.telegram.org с токеном бота в URL —
      // токен был виден в devtools любому пользователю (см. комментарий у
      // submitSupportRequest в lib/api.ts). Теперь просим бэкенд отправить
      // сообщение самому, токен туда не попадает.
      await submitSupportRequest({
        role,
        name,
        username,
        userId,
        message: `Заявка на доступ — ${role === "courier" ? "Курьер" : "Продавец"}. Время: ${new Date().toLocaleString("ru-RU", { timeZone: "Asia/Tashkent" })}`,
      });
    } catch { /* silent — экран всё равно покажет "заявка принята", бэкенд сам залогирует ошибку отправки */ }
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "32px 24px", textAlign: "center" }}>
        <div style={__style1}>✅</div>
        <div style={__style2}>Заявка принята!</div>
        <div style={{ fontSize: 15, color: C.muted, lineHeight: 1.6, maxWidth: 320 }}>
          Ваша заявка будет рассмотрена в течение <span style={{ color: C.teal, fontWeight: 700 }}>24 часов</span>.<br /><br />
          Мы свяжемся с вами и выдадим логин и пароль.
        </div>
        <button onClick={onBack} style={{ marginTop: 36, background: C.card, border: `1px solid ${C.border}`, color: C.soft, borderRadius: 14, padding: "13px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          ← Вернуться
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, display: "flex", flexDirection: "column" }}>
      {/* Шапка */}
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: "16px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.soft, fontSize: 13, cursor: "pointer", padding: 0 }}>← Назад</button>
      </div>

      <div style={__style3}>
        <div style={__style4}>
          <div style={__style5}><AppleEmoji e={roleIcon} size={52} /></div>
          <div style={{ fontSize: 9, color: C.amber, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>AquaMarjon</div>
          <div style={__style6}>Нет доступа?</div>
          <div style={{ fontSize: 14, color: C.muted, marginTop: 8, lineHeight: 1.6, maxWidth: 300, margin: "8px auto 0" }}>
            Чтобы стать {roleLabel} AquaMarjon, свяжитесь с нами — мы выдадим вам логин и пароль.
          </div>
        </div>

        <div style={__style7}>
          {/* Написать в Telegram */}
          <a
            href={TG_SUPPORT}
            target="_blank"
            rel="noreferrer"
            style={__style8}
          >
            <span style={__style9}>✈️</span>
            <div>
              <div style={__style10}>Написать в Telegram</div>
              <div style={__style11}>Поддержка @aquauz_support</div>
            </div>
          </a>

          {/* Заявка на звонок */}
          <button
            onClick={handleCallRequest}
            disabled={submitting}
            style={{
              display: "flex", alignItems: "center", gap: 14,
              background: `linear-gradient(135deg, ${C.teal}, #00A896)`,
              border: "none", borderRadius: 16, padding: "16px 20px",
              cursor: "pointer", boxShadow: `0 6px 24px ${C.teal}44`,
              opacity: submitting ? 0.7 : 1,
            }}
          >
            <span style={__style9}>📞</span>
            <div style={__style12}>
              <div style={__style13}>{submitting ? "Отправляем..." : "Заявка на звонок"}</div>
              <div style={__style14}>Мы перезвоним вам в течение 24 часов</div>
            </div>
          </button>

          <div style={{ textAlign: "center", fontSize: 12, color: C.muted, marginTop: 8 }}>
            Логин и пароль выдаёт только администратор AquaMarjon
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Экран входа для курьера/продавца ─────────────────────────
