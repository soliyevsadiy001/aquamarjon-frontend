import React from "react";
import { COLORS } from "../../theme";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";

/* ---- hoisted static styles (perf: avoid re-allocating on every render) ---- */
const __style1 = {
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
        background: COLORS.amber, color: COLORS.bg, textAlign: "center",
        fontSize: 12, fontWeight: 700, padding: "6px 10px",
      } as const;
const __style2 = {
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
        background: COLORS.teal, color: COLORS.bg, textAlign: "center",
        fontSize: 12, fontWeight: 700, padding: "6px 10px",
      } as const;


export function OfflineBanner() {
  const { online, justReconnected } = useOnlineStatus();
  if (!online) {
    return (
      <div style={__style1}>
        📡 Нет соединения — каталог, корзина и избранное доступны офлайн. Оформление заказа и AI-функции требуют интернет.
      </div>
    );
  }
  if (justReconnected) {
    return (
      <div style={__style2}>
        ✅ Снова онлайн — синхронизируем данные
      </div>
    );
  }
  return null;
}

// ============================================================
// Хуки состояния, вынесенные из App().
//
// Раньше App() держал 15+ независимых useState (включая часть тех,
// что и раньше синхронизировались с localStorage через пары
// useState+useEffect) — это делало сам компонент App длинным и
// трудным для просмотра, хотя большая часть этого состояния логически
// не связана друг с другом (корзина не знает про избранное, избранное
// не знает про подписки). Каждый кусок вынесен в свой хук:
// - хуки ничего не знают про экраны/навигацию, поэтому их можно
//   переиспользовать или тестировать отдельно от App;
// - имена переменных, которые они возвращают, совпадают с прежними
//   локальными именами в App() (cart, wishlist, toggleWishlist,
//   subscriptions, notifPrefs, orders...), поэтому весь JSX ниже по
//   файлу, прокидывающий их в пропсы экранов, не пришлось менять.

// Общая пара "состояние, синхронизированное с localStorage" — раньше
// в App() было пять отдельных `useState(() => readLocal(...))` +
// `useEffect(() => writeLocal(...))` рядом друг с другом; теперь это
// одна универсальная реализация.
