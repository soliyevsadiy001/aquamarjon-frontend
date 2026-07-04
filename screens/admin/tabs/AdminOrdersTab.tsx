import { A } from "../../../lib/admin-styles";
import { ADMIN_SC } from "../../../data/admin-seed";
import { COLORS } from "../../../theme";
import { NEXT_STATUS } from "../../../data/orders";
import { StatusBadge } from "../../../components/ui/AdminControls";
import { __style8, __style11, __style15, __style29, __style38, __style46, __style50, __style51 } from "../admin-panel-shared-styles";

/* Стили, используемые только в этой вкладке (вынесены на верхний уровень модуля,
   чтобы не пересоздавались при каждом рендере). */
const __style28 = { fontSize: 14, fontWeight: 700, marginBottom: 10 } as const;
const __style30 = { textAlign: "center", color: A.muted, fontSize: 13, marginTop: 30 } as const;
const __style31 = { padding: "12px 14px", cursor: "pointer" } as const;
const __style32 = { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } as const;
const __style33 = { fontSize: 14, fontWeight: 800 } as const;
const __style34 = { fontSize: 12, color: A.muted, marginLeft: 8 } as const;
const __style35 = { fontSize: 13, fontWeight: 600, marginTop: 4 } as const;
const __style36 = { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 } as const;
const __style37 = { fontSize: 14, fontWeight: 800, color: A.amber } as const;
const __style39 = { fontSize: 12, fontWeight: 700, color: A.soft, marginBottom: 6 } as const;
const __style40 = { display: "flex", justifyContent: "space-between", fontSize: 12, color: A.muted, marginBottom: 3 } as const;
const __style41 = { color: A.amber } as const;
const __style42 = { borderTop: `1px solid ${A.border}`, marginTop: 6, paddingTop: 6, display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 800 } as const;
const __style43 = { marginTop: 10, fontSize: 12, color: A.muted } as const;
const __style44 = { marginTop: 3 } as const;
const __style45 = { marginTop: 10 } as const;
const __style47 = { width: "100%", background: COLORS.panel, border: `1px solid ${A.border}`, borderRadius: 8, padding: "7px 10px", color: A.text, fontSize: 12, outline: "none", resize: "none", boxSizing: "border-box", minHeight: 50 } as const;
const __style48 = { display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 } as const;
const __style49 = { display: "flex", gap: 8, marginTop: 12 } as const;

export function AdminOrdersTab({
  couriers,
  filteredOrders,
  orderFilter,
  setOrderFilter,
  openOrderId,
  setOpenOrderId,
  moveOrderStatus,
  cancelOrder,
  updateOrderNote,
  assignCourier,
}: any) {
  return (
        <div style={__style11}>
          <div style={__style28}>Заказы ({filteredOrders.length})</div>

          {/* Фильтр */}
          <div style={__style29}>
            {[["all", "Все"], ...Object.entries(ADMIN_SC).map(([k, s]) => [k, s.label])].map(([k, l]) => (
              <button key={k} onClick={() => setOrderFilter(k)} style={{
                whiteSpace: "nowrap",
                background: orderFilter === k ? A.teal : COLORS.panel,
                color: orderFilter === k ? COLORS.bg : A.soft,
                border: `1px solid ${orderFilter === k ? A.teal : A.border}`,
                borderRadius: 999, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer",
              }}>{l}</button>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div style={__style30}>Нет заказов в этой категории</div>
          )}

          {filteredOrders.map(o => {
            const isOpen = openOrderId === o.id;
            const next = NEXT_STATUS[o.status];
            return (
              <div key={o.id} style={{ background: A.card, border: `1px solid ${o.status === "accepted" ? A.amber + "77" : o.status === "cancelled" ? A.red + "44" : A.border}`, borderRadius: 14, marginBottom: 10, overflow: "hidden" }}>
                {/* Шапка карточки */}
                <div onClick={() => setOpenOrderId(isOpen ? null : o.id)} style={__style31}>
                  <div style={__style32}>
                    <div>
                      <span style={__style33}>#{o.id}</span>
                      <span style={__style34}>{o.time} · {o.date}</span>
                    </div>
                    <StatusBadge status={o.status} />
                  </div>
                  <div style={__style35}>{o.buyer} · 📍 {o.region}</div>
                  <div style={__style15}>{o.items.map(i => i.name).join(", ")}</div>
                  <div style={__style36}>
                    <span style={__style8}>{o.courier ? `🏍️ ${o.courier}` : "Курьер не назначен"}</span>
                    <span style={__style37}>{o.total.toLocaleString("ru-RU")} сум</span>
                  </div>
                </div>

                {/* Раскрытая детальная карточка */}
                {isOpen && (
                  <div style={__style38}>

                    {/* Состав заказа */}
                    <div style={__style39}>Состав:</div>
                    {o.items.map((it, i) => (
                      <div key={i} style={__style40}>
                        <span>{it.name}</span><span style={__style41}>{it.price.toLocaleString("ru-RU")} сум</span>
                      </div>
                    ))}
                    <div style={__style42}>
                      <span>Итого</span><span style={__style41}>{o.total.toLocaleString("ru-RU")} сум</span>
                    </div>

                    {/* Адрес и телефон */}
                    <div style={__style43}>
                      <div>📱 {o.phone}</div>
                      <div style={__style44}>📍 {o.address}</div>
                    </div>

                    {/* Заметка */}
                    <div style={__style45}>
                      <div style={__style46}>Заметка:</div>
                      <textarea value={o.note} onChange={e => updateOrderNote(o.id, e.target.value)} placeholder="Добавить заметку..."
                        style={__style47} />
                    </div>

                    {/* Назначить курьера */}
                    <div style={__style45}>
                      <div style={__style46}>Курьер:</div>
                      <div style={__style48}>
                        {couriers.filter(c => c.online && !c.blocked && c.region === o.region).concat(couriers.filter(c => c.online && !c.blocked && c.region !== o.region)).slice(0, 5).map(c => (
                          <button key={c.id} onClick={() => assignCourier(o.id, c.name)} style={{
                            whiteSpace: "nowrap", background: o.courier === c.name ? A.teal + "33" : COLORS.panel,
                            border: `1px solid ${o.courier === c.name ? A.teal : A.border}`,
                            borderRadius: 8, padding: "5px 10px", fontSize: 11, color: o.courier === c.name ? A.teal : A.soft, cursor: "pointer",
                          }}>{c.region === o.region ? "📍 " : ""}{c.name}</button>
                        ))}
                      </div>
                    </div>

                    {/* Кнопки действий */}
                    <div style={__style49}>
                      {next && (
                        <button onClick={() => moveOrderStatus(o.id, next)} style={__style50}>
                          → {ADMIN_SC[next]?.label}
                        </button>
                      )}
                      {o.status !== "cancelled" && o.status !== "delivered" && (
                        <button onClick={() => cancelOrder(o.id)} style={__style51}>
                          Отменить
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
  );
}
