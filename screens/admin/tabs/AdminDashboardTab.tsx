import { A } from "../../../lib/admin-styles";
import { COLORS } from "../../../theme";
import { ADMIN_SC } from "../../../data/admin-seed";
import { Sticker } from "../../../components/ui/Sticker";
import { __style11, __style15, __style20 } from "../admin-panel-shared-styles";

/* Стили, используемые только в этой вкладке (вынесены на верхний уровень модуля,
   чтобы не пересоздавались при каждом рендере). */
const __style12 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 } as const;
const __style13 = { background: A.card, border: `1px solid ${A.border}`, borderRadius: 14, padding: "14px 12px" } as const;
const __style14 = { marginBottom: 4 } as const;
const __style16 = { background: A.card, border: `1px solid ${A.border}`, borderRadius: 14, padding: "14px", marginBottom: 16 } as const;
const __style17 = { fontSize: 13, fontWeight: 700, marginBottom: 12 } as const;
const __style18 = { marginBottom: 8 } as const;
const __style19 = { display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 } as const;
const __style21 = { height: 5, background: COLORS.panel, borderRadius: 3, overflow: "hidden" } as const;
const __style22 = { fontSize: 13, fontWeight: 700, marginBottom: 10 } as const;
const __style23 = { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 } as const;
const __style24 = { flex: 1, fontSize: 12.5, fontWeight: 600 } as const;
const __style25 = { fontSize: 12, color: A.amber, fontWeight: 700 } as const;
const __style26 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 } as const;
const __style27 = { background: COLORS.panel, border: `1px solid ${A.border}`, borderRadius: 12, padding: "12px", fontSize: 13, color: A.soft, cursor: "pointer", fontWeight: 600, textAlign: "center" } as const;

export function AdminDashboardTab({
  orders,
  products,
  promos,
  settings,
  activeProducts,
  lowStockCount,
  onlineCouriers,
  pendingOrders,
  todayOrders,
  todayRevenue,
  setOrderFilter,
  setProductFilter,
  setTab,
}: any) {
  return (
        <div style={__style11}>

          {/* KPI карточки */}
          <div style={__style12}>
            {[
              { icon: "🛒", label: "Заказов сегодня", value: todayOrders.length, color: A.teal },
              { icon: "💰", label: "Выручка сегодня", value: (todayRevenue / 1000).toFixed(0) + "K", color: A.amber },
              { icon: "🐠", label: "Активных товаров", value: activeProducts, color: A.teal },
              { icon: "⚠️", label: "Мало на складе", value: lowStockCount, color: lowStockCount > 0 ? A.red : A.green },
              { icon: "🏍️", label: "Курьеров онлайн", value: onlineCouriers, color: A.teal },
              { icon: "📋", label: "Ожидают обработки", value: pendingOrders, color: pendingOrders > 0 ? A.amber : A.green },
            ].map((s, i) => (
              <div key={i} style={__style13}>
                <div style={__style14}><Sticker e={s.icon} size={32} /></div>
                <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={__style15}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Мини-воронка статусов */}
          <div style={__style16}>
            <div style={__style17}>📊 Статусы заказов</div>
            {Object.entries(ADMIN_SC).map(([key, s]) => {
              const cnt = orders.filter(o => o.status === key).length;
              const pct = orders.length ? Math.round(cnt / orders.length * 100) : 0;
              return (
                <div key={key} style={__style18}>
                  <div style={__style19}>
                    <span style={{ color: s.color, fontWeight: 700 }}>{s.label}</span>
                    <span style={__style20}>{cnt} шт ({pct}%)</span>
                  </div>
                  <div style={__style21}>
                    <div style={{ width: pct + "%", height: "100%", background: s.color, borderRadius: 3, transition: "width 0.4s" }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ТОП товаров */}
          <div style={__style16}>
            <div style={__style22}>🏆 Топ товаров по продажам</div>
            {[...products].sort((a, b) => b.orders - a.orders).slice(0, 5).map((p, i) => (
              <div key={p.id} style={__style23}>
                <span style={{ fontSize: 14, fontWeight: 800, color: [A.amber, A.soft, A.muted, A.muted, A.muted][i], width: 16 }}>{i + 1}</span>
                <Sticker e={p.emoji} size={34} />
                <span style={__style24}>{p.name}</span>
                <span style={__style25}>{p.orders} шт</span>
              </div>
            ))}
          </div>

          {/* Кнопки быстрого доступа */}
          <div style={__style26}>
            {[
              { label: "📦 Новые заказы", action: () => { setTab("orders"); setOrderFilter("accepted"); } },
              { label: "⚠️ Мало товаров", action: () => { setTab("products"); setProductFilter("low"); } },
              { label: "🎁 Промокоды",    action: () => setTab("promos") },
              { label: "⚙️ Настройки",   action: () => setTab("settings") },
            ].map(b => (
              <button key={b.label} onClick={b.action} style={__style27}>{b.label}</button>
            ))}
          </div>
        </div>
  );
}
