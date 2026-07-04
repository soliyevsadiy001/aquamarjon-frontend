import { A } from "../../../lib/admin-styles";
import { COLORS } from "../../../theme";
import { AInp, AdminToggle } from "../../../components/ui/AdminControls";
import { Sticker } from "../../../components/ui/Sticker";
import { __style11, __style15, __style46, __style63, __style92, __style93, __style119 } from "../admin-panel-shared-styles";

/* Стили, используемые только в этой вкладке (вынесены на верхний уровень модуля,
   чтобы не пересоздавались при каждом рендере). */
const __style134 = { fontSize: 14, fontWeight: 700, marginBottom: 14 } as const;
const __style135 = { background: A.card, border: `1px solid ${A.border}`, borderRadius: 14, padding: "12px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 } as const;
const __style136 = { fontSize: 13, fontWeight: 700, margin: "18px 0 10px" } as const;
const __style137 = { background: A.card, border: `1px solid ${A.border}`, borderRadius: 14, padding: "14px", marginBottom: 10 } as const;
const __style138 = { display: "flex", gap: 8, alignItems: "center" } as const;
const __style139 = { flex: 1, accentColor: A.teal } as const;
const __style140 = { fontSize: 16, fontWeight: 800, color: A.teal, minWidth: 40, textAlign: "right" } as const;
const __style141 = { background: A.card, border: `1px solid ${A.border}`, borderRadius: 14, padding: "14px", marginBottom: 18 } as const;
const __style142 = { width: "100%", background: A.teal, color: COLORS.bg, border: "none", borderRadius: 12, padding: "13px", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 16 } as const;
const __style143 = { background: "#1A0808", border: `1px solid ${A.red}33`, borderRadius: 14, padding: "16px" } as const;
const __style144 = { fontSize: 13, fontWeight: 700, color: A.red, marginBottom: 6 } as const;
const __style145 = { fontSize: 12, color: A.muted, marginBottom: 12 } as const;
const __style146 = { background: "none", border: `1px solid ${A.red}`, color: A.red, borderRadius: 10, padding: "9px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" } as const;
const __style147 = { fontSize: 12, color: A.red, marginBottom: 8 } as const;
const __style148 = { flex: 1, background: COLORS.panel, color: A.soft, border: `1px solid ${A.border}`, borderRadius: 10, padding: "9px", fontSize: 13, cursor: "pointer" } as const;
const __style149 = { flex: 2, background: A.red, color: "#fff", border: "none", borderRadius: 10, padding: "9px", fontSize: 13, fontWeight: 700, cursor: "pointer" } as const;

export function AdminSettingsTab({
  settings,
  confirmClose,
  setConfirmClose,
  setSetting,
  showToast,
}: any) {
  return (
        <div style={__style11}>
          <div style={__style134}>Настройки системы</div>

          {/* Переключатели */}
          {[
            { key: "storeOpen",          label: "Магазин открыт",          sub: "Принимаем заказы от клиентов",      icon: "🏪" },
            { key: "smsNotify",          label: "SMS-уведомления",          sub: "Клиентам при смене статуса заказа", icon: "📱" },
            { key: "aiDoctor",           label: "AI-доктор рыб",            sub: "Доступен клиентам в приложении",   icon: "🩺" },
            { key: "courierSignup",      label: "Приём курьеров",           sub: "Регистрация новых курьеров",        icon: "🏍️" },
            { key: "autoAssignCourier",  label: "Авто-назначение курьера",  sub: "По ближайшему региону к заказу",   icon: "🤖" },
            { key: "cashPayment",        label: "Оплата наличными",         sub: "Наличными курьеру при получении",  icon: "💵" },
            { key: "clickPayment",       label: "Оплата Click",             sub: "QR-код при оформлении заказа",     icon: "🟦" },
            { key: "paymePayment",       label: "Оплата Payme",             sub: "Карты Uzcard и Humo",              icon: "🟢" },
          ].map(s => (
            <div key={s.key} style={__style135}>
              <Sticker e={s.icon} size={38} />
              <div style={__style92}>
                <div style={__style93}>{s.label}</div>
                <div style={__style15}>{s.sub}</div>
              </div>
              <AdminToggle value={settings[s.key]} onChange={v => setSetting(s.key, v)} />
            </div>
          ))}

          {/* Числовые настройки */}
          <div style={__style136}>Параметры</div>
          <div style={__style137}>
            <div style={__style46}>Гарантия здоровья рыб (часов)</div>
            <div style={__style138}>
              <input type="range" min={12} max={96} step={12} value={settings.guaranteeHours} onChange={e => setSetting("guaranteeHours", Number(e.target.value))}
                style={__style139} />
              <span style={__style140}>{settings.guaranteeHours} ч</span>
            </div>
          </div>

          <div style={__style137}>
            <div style={__style119}>Телефон поддержки</div>
            <AInp value={settings.supportPhone} onChange={v => setSetting("supportPhone", v)} />
          </div>

          <div style={__style141}>
            <div style={__style119}>Время работы</div>
            <AInp value={settings.supportHours} onChange={v => setSetting("supportHours", v)} />
          </div>

          <button onClick={() => { showToast("Настройки сохранены ✅"); }} style={__style142}>
            💾 Сохранить настройки
          </button>

          {/* Опасная зона */}
          <div style={__style143}>
            <div style={__style144}>🔴 Опасная зона</div>
            <div style={__style145}>Закрыть магазин — клиенты не смогут оформлять заказы</div>
            {!confirmClose ? (
              <button onClick={() => setConfirmClose(true)} style={__style146}>
                {settings.storeOpen ? "Закрыть магазин" : "Открыть магазин"}
              </button>
            ) : (
              <div>
                <div style={__style147}>Вы уверены?</div>
                <div style={__style63}>
                  <button onClick={() => setConfirmClose(false)} style={__style148}>Отмена</button>
                  <button onClick={() => { setSetting("storeOpen", !settings.storeOpen); setConfirmClose(false); showToast(settings.storeOpen ? "Магазин закрыт" : "Магазин открыт", settings.storeOpen ? "bad" : "ok"); }} style={__style149}>Подтвердить</button>
                </div>
              </div>
            )}
          </div>
        </div>
  );
}
