import React, { useState } from "react";
import { COLORS } from "../../theme";
import { notifyTelegram } from "../../lib/notify";

export function WaterReminder({ days, tankName, notifEnabled = true }) {
  const urgent = days >= 7;
  const [sent, setSent] = useState(false);
  async function handleRemind() {
    if (!notifEnabled) return;
    const ok = await notifyTelegram("water_reminder", { tankName, daysAgo: days });
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  }
  return (
    <div
      style={{
        marginTop: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: urgent ? COLORS.redBg : COLORS.greenBg,
        border: `1px solid ${urgent ? COLORS.red : COLORS.border}`,
        borderRadius: 10,
        padding: "8px 12px",
        fontSize: 12,
      }}
    >
      <span style={{ color: urgent ? "#FF8F8F" : COLORS.soft }}>
        {urgent ? "⚠️ Пора менять воду! " : "💧 "}Последняя смена воды: {days} {days === 1 ? "день" : "дней"} назад
      </span>
      {urgent && (
        <span
          onClick={handleRemind}
          style={{ color: sent ? COLORS.teal : COLORS.red, fontWeight: 700, whiteSpace: "nowrap", marginLeft: 8, cursor: "pointer" }}
        >
          {sent ? "✓ Отправлено в Telegram" : "Напомнить"}
        </span>
      )}
    </div>
  );
}

