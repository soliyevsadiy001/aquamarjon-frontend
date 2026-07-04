import React from "react";
import { COLORS } from "../../theme";
import { Sticker } from "../../components/ui/Sticker";
import { checkCompatibility, formatSum } from "../../lib/catalog-utils";

/* ---- hoisted static styles (perf: avoid re-allocating on every render) ---- */
const __style1 = {
      position: "fixed", inset: 0, background: "rgba(5,10,16,0.85)",
      zIndex: 170, display: "flex", alignItems: "flex-end",
    } as const;
const __style2 = {
        background: COLORS.bg2, width: "100%", maxHeight: "88vh",
        borderRadius: "20px 20px 0 0", overflowY: "auto",
        color: COLORS.text,
      } as const;
const __style3 = { padding: "18px 18px 0", display: "flex", justifyContent: "space-between", alignItems: "center" } as const;
const __style4 = { fontSize: 15, fontWeight: 800 } as const;
const __style5 = { background: "none", border: "none", color: COLORS.muted, fontSize: 20, cursor: "pointer" } as const;
const __style6 = { textAlign: "center", padding: "0 4px", position: "relative" } as const;
const __style7 = { position: "absolute", top: -6, right: 2, background: COLORS.border, border: "none", borderRadius: "50%", width: 16, height: 16, color: COLORS.soft, fontSize: 10, cursor: "pointer", lineHeight: "16px", padding: 0 } as const;
const __style8 = { display: "flex", justifyContent: "center" } as const;
const __style9 = { fontSize: 10.5, fontWeight: 700, lineHeight: 1.3, marginTop: 4, color: COLORS.text } as const;
const __style10 = { margin: "12px 18px", display: "flex", flexDirection: "column", gap: 6 } as const;
const __style11 = { background: COLORS.greenBg2, border: `1px solid ${COLORS.teal}`, borderRadius: 10, padding: "8px 12px", fontSize: 12, textAlign: "center", color: COLORS.teal, fontWeight: 600 } as const;
const __style12 = { padding: "0 18px 32px", overflowX: "auto" } as const;
const __style13 = { fontSize: 11, color: COLORS.muted, width: 90, paddingRight: 8 } as const;
const __style14 = { fontSize: 12, fontWeight: 600, textAlign: "center", color: COLORS.soft2 } as const;


export function CompareModal({ fishes, onClose, onRemove }) {
  const list = (fishes || []).filter(Boolean);
  if (list.length < 2) return null;
  const sizeLabel = (f) => f.size === "small" ? "Мелкая" : f.size === "medium" ? "Средняя" : "Крупная";
  const temperLabel = (f) => f.temper === "peaceful" ? "Мирная" : f.temper === "aggressive" ? "Хищная" : "Полумирная";
  const diffLabel = (f) => f.difficulty === "easy" ? "🌱 Легко" : f.difficulty === "medium" ? "🟡 Средне" : "🔴 Сложно";
  const originLabel = (f) => f.origin === "local" ? "🏠 Местная" : "✈️ Привозная";
  const rows = [
    { label: "Цена", get: (f) => formatSum(f.price) },
    { label: "Рейтинг", get: (f) => `⭐ ${f.rating}` },
    { label: "Размер", get: sizeLabel },
    { label: "Темперамент", get: temperLabel },
    { label: "Температура", get: (f) => `${f.temp[0]}–${f.temp[1]}°C` },
    { label: "Мин. объём", get: (f) => `${f.minVolume} л` },
    { label: "Сложность", get: diffLabel },
    { label: "Происхождение", get: originLabel },
  ];
  // Совместимость каждой пары
  const pairWarnings = [];
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const c = checkCompatibility(list[i], [list[j]]);
      if (c.level !== "ok") pairWarnings.push({ a: list[i], b: list[j], c });
    }
  }
  const gridCols = `90px repeat(${list.length}, 1fr)`;
  return (
    <div style={__style1} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={__style2}>
        {/* Header */}
        <div style={__style3}>
          <div style={__style4}>⚖️ Сравнение рыб ({list.length})</div>
          <button onClick={onClose} style={__style5} aria-label="Закрыть">✕</button>
        </div>
        {/* Fish heads */}
        <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: 0, padding: "14px 18px 0", overflowX: "auto" }}>
          <div />
          {list.map(fish => (
            <div key={fish.id} style={__style6}>
              {onRemove && list.length > 2 && (
                <button onClick={() => onRemove(fish.id)} style={__style7} aria-label={`Убрать «${fish.name}» из сравнения`}>✕</button>
              )}
              <div style={__style8}><Sticker e={fish.img} size={48} /></div>
              <div style={__style9}>{fish.name}</div>
            </div>
          ))}
        </div>
        {/* Compat banner(s) */}
        <div style={__style10}>
          {pairWarnings.length === 0 ? (
            <div style={__style11}>
              ✅ Все выбранные рыбы отлично уживутся вместе
            </div>
          ) : pairWarnings.map((w, i) => (
            <div key={i} style={{
              background: w.c.level === "bad" ? COLORS.redBg : "#1E1800",
              border: `1px solid ${w.c.level === "bad" ? COLORS.red : COLORS.amber}`,
              borderRadius: 10, padding: "8px 12px", fontSize: 11.5, textAlign: "center",
              color: w.c.level === "bad" ? COLORS.red : COLORS.amber, fontWeight: 600,
            }}>
              {w.c.level === "bad" ? "⚠️" : "🟡"} {w.a.name.split(" ")[0]} + {w.b.name.split(" ")[0]}: {w.c.reason}
            </div>
          ))}
        </div>
        {/* Table */}
        <div style={__style12}>
          {rows.map((r, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: gridCols,
              gap: 0, borderBottom: `1px solid ${COLORS.border}`,
              padding: "10px 0", minWidth: 90 + list.length * 80,
            }}>
              <div style={__style13}>{r.label}</div>
              {list.map(f => (
                <div key={f.id} style={__style14}>{r.get(f)}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   WOW-ФИЧА 3: «Посмотреть в моём аквариуме» — псевдо-AR
   Камера (серый фон) + анимированная рыбка поверх
   ============================================================ */
