import { A } from "../../../lib/admin-styles";
import { AInp, AdminToggle } from "../../../components/ui/AdminControls";
import { COLORS } from "../../../theme";
import { __style8, __style11, __style20, __style55, __style60, __style92, __style93 } from "../admin-panel-shared-styles";

/* Стили, используемые только в этой вкладке (вынесены на верхний уровень модуля,
   чтобы не пересоздавались при каждом рендере). */
const __style88 = { fontSize: 14, fontWeight: 700, marginBottom: 6 } as const;
const __style89 = { display: "flex", gap: 16, fontSize: 12, color: A.muted, marginBottom: 14 } as const;
const __style90 = { color: A.teal } as const;
const __style91 = { color: A.red } as const;
const __style94 = { fontSize: 11, color: A.muted, marginTop: 1 } as const;
const __style95 = { marginTop: 10, display: "flex", gap: 8, alignItems: "center" } as const;
const __style96 = { fontSize: 11, color: A.soft, marginBottom: 3 } as const;

export function AdminCouriersTab({
  couriers,
  toggleCourierOnline,
  toggleCourierBlock,
  updateCourierRate,
}: any) {
  return (
        <div style={__style11}>
          <div style={__style88}>Курьеры — всего {couriers.length}</div>
          <div style={__style89}>
            <span style={__style90}>● Онлайн: {couriers.filter(c => c.online && !c.blocked).length}</span>
            <span style={__style20}>○ Оффлайн: {couriers.filter(c => !c.online || c.blocked).length}</span>
            <span style={__style91}>⛔ Блок: {couriers.filter(c => c.blocked).length}</span>
          </div>

          {couriers.map(c => (
            <div key={c.id} style={{ background: A.card, border: `1px solid ${c.blocked ? A.red + "44" : A.border}`, borderRadius: 14, padding: "12px 14px", marginBottom: 10 }}>
              <div style={__style55}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: COLORS.panel, border: `1px solid ${c.online && !c.blocked ? A.teal : A.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: A.teal, flexShrink: 0 }}>
                  {c.name.split(" ").map(w => w[0]).join("")}
                </div>
                <div style={__style92}>
                  <div style={__style93}>{c.name}</div>
                  <div style={__style8}>📍 {c.region} · ⭐ {c.rating} · {c.trips} рейсов</div>
                  <div style={__style94}>{c.phone}</div>
                </div>
                <div style={__style60}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: c.blocked ? A.red : c.online ? A.teal : A.muted }}>
                    {c.blocked ? "⛔ Блок" : c.online ? "● Онлайн" : "○ Офлайн"}
                  </div>
                  {!c.blocked && (
                    <AdminToggle value={c.online} onChange={() => toggleCourierOnline(c.id)} />
                  )}
                </div>
              </div>

              <div style={__style95}>
                <div style={__style92}>
                  <div style={__style96}>Тариф доставки (сум)</div>
                  <AInp type="number" value={c.rate} onChange={v => updateCourierRate(c.id, v)} />
                </div>
                <button onClick={() => toggleCourierBlock(c.id)} style={{
                  marginTop: 18, background: c.blocked ? A.teal + "22" : COLORS.redBg,
                  border: `1px solid ${c.blocked ? A.teal : A.red}`,
                  color: c.blocked ? A.teal : A.red,
                  borderRadius: 10, padding: "9px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
                }}>
                  {c.blocked ? "✅ Разблок." : "⛔ Заблок."}
                </button>
              </div>
            </div>
          ))}
        </div>
  );
}
