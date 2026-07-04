import React, { useRef, useState } from "react";
import { COLORS } from "../../theme";
import { getRewardPromos } from "../../lib/achievement-promo";
import { Dp } from "../../lib/doctor-styles";
import { PromoResult, applyPromoImpl } from "../../lib/promo";
import { CkField } from "../../screens/checkout/CkFields";

/* ---- hoisted static styles (perf: avoid re-allocating on every render) ---- */
const __style1 = {
        display: "inline-block", width: 14, height: 14,
        border: `2px solid ${COLORS.border}`, borderTopColor: COLORS.teal,
        borderRadius: "50%", animation: "aquaSpin 0.65s linear infinite",
      } as const;
const __style2 = { display: "flex", gap: 8 } as const;
const __style3 = {
            flexShrink: 0, background: "#1C1414", border: `1px solid ${COLORS.red}`,
            borderRadius: 12, padding: "11px 14px", color: COLORS.red,
            fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
          } as const;
const __style4 = { fontSize: 11, color: COLORS.red, marginTop: 5, display: "flex", alignItems: "center", gap: 4 } as const;
const __style5 = { fontSize: 11, color: Dp.muted, marginTop: 6 } as const;
const __style6 = {
          marginTop: 8, background: COLORS.greenBg2, border: "1px solid #00C9B133",
          borderRadius: 10, padding: "10px 12px", display: "flex",
          alignItems: "center", justifyContent: "space-between",
        } as const;
const __style7 = { fontSize: 12, color: COLORS.green2, fontWeight: 700 } as const;
const __style8 = { fontSize: 13, color: COLORS.text, marginTop: 2 } as const;
const __style9 = {
            fontSize: 11, background: COLORS.greenBg, border: "1px solid #00C9B133",
            borderRadius: 8, padding: "3px 8px", color: COLORS.teal, fontFamily: "monospace",
          } as const;
const __style10 = { fontSize: 11, color: COLORS.muted, marginTop: 6 } as const;


export function PromoSpinner() {
  return (
    <>
      <style>{`@keyframes aquaSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <span style={__style1} />
      <span>Проверяем…</span>
    </>
  );
}


export function PromoField({ subtotal, userId, items, promoResult, onApply }: {
  subtotal: number; userId?: number;
  items?: Array<{ id: string; price: number; qty: number }>;
  promoResult: PromoResult | null;
  onApply: (r: PromoResult | null) => void;
}) {
  const [input, setInput] = useState(promoResult?.code ?? "");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const applied = promoResult !== null;

  async function handleApply() {
    if (loading) return;
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    setErr("");
    try {
      const { result, error } = await applyPromoImpl(input, subtotal, userId, ctrl.signal, items);
      if (error) {
        setErr(error);
        onApply(null);
      } else if (result) {
        onApply(result);
        setErr("");
      }
    } catch (e: any) {
      if (e.name === "AbortError") return;
      setErr("Нет соединения. Проверьте интернет и попробуйте снова.");
      onApply(null);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setInput("");
    setErr("");
    onApply(null);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleApply();
  }

  const borderColor = err ? COLORS.red : applied ? COLORS.green2 : COLORS.border;

  return (
    <CkField label="Промокод">
      <div style={__style2}>
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setErr("");
            if (applied) onApply(null);
          }}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder="Напр.: AQUA10"
          style={{
            flex: 1, background: COLORS.panel, border: `1px solid ${borderColor}`,
            borderRadius: 12, padding: "11px 14px", color: COLORS.text, fontSize: 14,
            outline: "none", textTransform: "uppercase", opacity: loading ? 0.6 : 1,
            transition: "border-color 0.15s, opacity 0.15s",
          }}
        />
        {applied ? (
          <button onClick={handleReset} style={__style3}>✕ Убрать</button>
        ) : (
          <button onClick={handleApply} disabled={loading || !input.trim()} style={{
            flexShrink: 0, background: loading || !input.trim() ? COLORS.bg2 : COLORS.greenBg,
            border: `1px solid ${loading || !input.trim() ? COLORS.border : COLORS.teal}`,
            borderRadius: 12, padding: "11px 16px", color: loading || !input.trim() ? COLORS.muted : COLORS.teal,
            fontSize: 13, fontWeight: 700, cursor: loading || !input.trim() ? "default" : "pointer",
            minWidth: 96, transition: "all 0.15s", display: "flex", alignItems: "center",
            justifyContent: "center", gap: 6,
          }}>
            {loading ? <PromoSpinner /> : "Применить"}
          </button>
        )}
      </div>
      {err && (
        <div style={__style4}>
          <span>⚠</span> {err}
        </div>
      )}
      {!applied && !err && (() => {
        const rewardCodes = Object.keys(getRewardPromos());
        if (rewardCodes.length === 0) return null;
        return (
          <div style={__style5}>
            🎁 У вас есть {rewardCodes.length} промокод{rewardCodes.length === 1 ? "" : "а"} за достижения в 📔 Дневнике — введите его выше
          </div>
        );
      })()}
      {applied && promoResult && (
        <div style={__style6}>
          <div>
            <div style={__style7}>✓ Промокод применён</div>
            <div style={__style8}>{promoResult.label}</div>
          </div>
          <span style={__style9}>{promoResult.code}</span>
        </div>
      )}
      {!applied && !err && (
        <div style={__style10}>
          Код выдаётся при первом заказе, через Telegram или реферальную программу
        </div>
      )}
    </CkField>
  );
}

/* ============================================================
   AquaMarjon — прототип
   Палитра: глубокий океан #08131F, бирюза #00C9B1, янтарь #F0A93C
   Шрифты (через систему): жирный display + лёгкий текст
   Сигнатурный элемент: "карта совместимости" — живой бейдж рыбы
   меняющий цвет в зависимости от того что уже лежит в корзине
   ============================================================ */

