import React, { useMemo } from "react";
import { COLORS } from "../../theme";
import { Sticker } from "../../components/ui/Sticker";
import { DELIVERY_RATES } from "../../data/regions";
import { checkCompatibility, formatSum } from "../../lib/catalog-utils";
import { baseDeliveryPrice, cartSubtotal } from "../../lib/checkout-utils";

/* ---- hoisted static styles (perf: avoid re-allocating on every render) ---- */
const __style1 = { position: "fixed", inset: 0, background: "rgba(5,10,16,0.6)", zIndex: 140 } as const;
const __style2 = {
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "86%",
          maxWidth: 360,
          background: COLORS.bg2,
          color: COLORS.text,
          padding: 18,
          overflowY: "auto",
          animation: "slideIn 0.2s ease-out",
        } as const;
const __style3 = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 } as const;
const __style4 = { fontSize: 17, fontWeight: 800, margin: 0 } as const;
const __style5 = { background: "none", border: "none", color: COLORS.soft, fontSize: 18, cursor: "pointer" } as const;
const __style6 = { color: COLORS.muted, fontSize: 14, textAlign: "center", marginTop: 40 } as const;
const __style7 = {
              background: COLORS.redBg,
              border: `1px solid ${COLORS.red}`,
              borderRadius: 10,
              padding: "10px 12px",
              fontSize: 13,
              marginBottom: 12,
            } as const;
const __style8 = {
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 0",
              borderBottom: "1px solid #15293A",
            } as const;
const __style9 = { flex: 1 } as const;
const __style10 = { fontSize: 13, fontWeight: 600 } as const;
const __style11 = { fontSize: 12, color: COLORS.amber } as const;
const __style12 = { background: "none", border: "none", color: COLORS.muted, fontSize: 16, cursor: "pointer" } as const;
const __style13 = { marginTop: 16, paddingTop: 12, borderTop: `1px solid ${COLORS.border}` } as const;
const __style14 = { display: "flex", justifyContent: "space-between", fontSize: 13, color: COLORS.soft, marginBottom: 6 } as const;
const __style15 = { display: "flex", justifyContent: "space-between", fontSize: 13, color: COLORS.soft, marginBottom: 2 } as const;
const __style16 = { fontSize: 11, color: COLORS.muted, marginBottom: 6 } as const;
const __style17 = { display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, marginTop: 10 } as const;
const __style18 = { color: COLORS.amber } as const;
const __style19 = {
                width: "100%",
                marginTop: 14,
                background: COLORS.teal,
                color: COLORS.bg,
                border: "none",
                borderRadius: 12,
                padding: "13px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
              } as const;


export function CartDrawer({ open, onClose, cart, onRemove, region, onCheckout }) {
  const subtotal = cartSubtotal(cart);
  const deliveryInfo = DELIVERY_RATES[region] || { price: 35000, time: "сегодня" };
  const delivery = baseDeliveryPrice(cart, deliveryInfo.price);
  const hasIssue = useMemo(() => {
    for (let i = 0; i < cart.length; i++) {
      for (let j = i + 1; j < cart.length; j++) {
        const c = checkCompatibility(cart[i], [cart[j]]);
        if (c.level === "bad") return true;
      }
    }
    return false;
  }, [cart]);

  if (!open) return null;
  return (
    <div
      style={__style1}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={__style2}
      >
        <div style={__style3}>
          <h3 style={__style4}>🐠 Ваш аквариум</h3>
          <button onClick={onClose} style={__style5} aria-label="Закрыть">✕</button>
        </div>

        {cart.length === 0 && (
          <p style={__style6}>
            Корзина пуста — выберите первую рыбку 🐠
          </p>
        )}

        {hasIssue && (
          <div
            style={__style7}
          >
            ⚠️ В корзине есть несовместимые соседи — посмотрите ниже
          </div>
        )}

        {cart.map((f, idx) => (
          <div
            key={f.id + idx}
            style={__style8}
          >
            <Sticker e={f.img} size={40} />
            <div style={__style9}>
              <div style={__style10}>{f.name}</div>
              <div style={__style11}>{formatSum(f.price)}</div>
            </div>
            <button
              onClick={() => onRemove(idx)}
              style={__style12}
            >
              ✕
            </button>
          </div>
        ))}

        {cart.length > 0 && (
          <div style={__style13}>
            <div style={__style14}>
              <span>Товары</span><span>{formatSum(subtotal)}</span>
            </div>
            <div style={__style15}>
              <span>🚚 Доставка · {region}</span><span>{formatSum(delivery)}</span>
            </div>
            <div style={__style16}>
              ⏱ Ориентировочно: {deliveryInfo.time}
            </div>
            <div style={__style17}>
              <span>Итого</span><span style={__style18}>{formatSum(subtotal + delivery)}</span>
            </div>
            <button
              onClick={onCheckout}
              style={__style19}
            >
              Заказать всё сразу →
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0.6; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </div>
  );
}

/* ============================================================
   UX: «Пока везут» — инструкция по подготовке аквариума
   ============================================================ */
