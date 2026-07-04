import { FISH_DB } from "../data/fish";

/* ------------------------------------------------------------
   Заказы с бэкенда (GET /orders) → форма, которую уже ожидают
   AdminOrdersTab / SellerCabinet / SellerOrderRow / CourierView.

   Раньше эти три экрана рисовали локальные демо-данные
   (data/admin-seed.ts, data/seller-seed.ts, data/demo-deliveries.ts),
   у каждого из которых была своя, немного другая форма заказа
   (например, items — то массив строк "Гуппи ×3", то массив
   {name, price}). Бэкенд теперь отдаёт один универсальный DTO
   (routes/orders.ts → toOrderDTO), а этот файл — единственное место,
   где он раскладывается под конкретный экран, чтобы сами компоненты
   менять не пришлось.
   ------------------------------------------------------------ */

export interface BackendOrderItem {
  id: string;
  name: string;
  price: number;
  qty?: number;
}

export interface BackendOrder {
  id: string;
  phone: string;
  region: string;
  address: string;
  comment: string;
  delivery_slot: string;
  pay_method: string;
  promo_code: string | null;
  promo_type: string | null;
  items: BackendOrderItem[];
  buyer_name: string;
  telegram_id: string | null;
  status: string;
  courier_name: string;
  note: string;
  created_at: string; // "YYYY-MM-DD HH:MM:SS" (SQLite datetime('now'))
}

export interface UIOrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  img?: string;
}

/** Единая раскладка заказа под UI. Поля-алиасы (buyer/client) оставлены
 *  специально — так меньше правок в каждом отдельном экране. */
export interface UIOrder {
  id: string;
  buyer: string;
  client: string;
  phone: string;
  region: string;
  address: string;
  comment: string;
  slot: string;
  pay: string;
  items: UIOrderItem[];
  itemNames: string[];
  total: number;
  status: string;
  courier: string;
  note: string;
  date: string;
  time: string;
  hasLivefish: boolean;
}

function findFishMeta(id: string) {
  return FISH_DB.find((f) => f.id === id || f.speciesId === id);
}

function splitCreatedAt(createdAt: string): { date: string; time: string } {
  if (!createdAt) return { date: "", time: "" };
  const [datePart, timePart] = createdAt.split(" ");
  let date = "";
  if (datePart) {
    const [y, m, d] = datePart.split("-");
    if (d && m) date = `${d}.${m}`;
  }
  const time = timePart ? timePart.slice(0, 5) : "";
  return { date, time };
}

export function mapBackendOrder(o: BackendOrder): UIOrder {
  const items: UIOrderItem[] = (o.items || []).map((it) => {
    const meta = findFishMeta(it.id);
    return { id: it.id, name: it.name, price: it.price, qty: it.qty || 1, img: meta?.img };
  });
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const itemNames = items.map((i) => (i.qty > 1 ? `${i.name} ×${i.qty}` : i.name));
  // Живая рыба требует бережной перевозки (см. CourierView) — считаем
  // заказ "живым", если в нём есть хоть одна позиция, распознанная как
  // рыба (или вообще не найденная в каталоге — на переходный период
  // безопаснее перестраховаться, чем потерять предупреждение курьеру).
  const hasLivefish = items.some((i) => {
    const meta = findFishMeta(i.id);
    return !meta || meta.type === "fish";
  });
  const { date, time } = splitCreatedAt(o.created_at);

  return {
    id: o.id,
    buyer: o.buyer_name || "Покупатель",
    client: o.buyer_name || "Покупатель",
    phone: o.phone || "",
    region: o.region || "",
    address: o.address || "",
    comment: o.comment || "",
    slot: o.delivery_slot || "",
    pay: o.pay_method || "",
    items,
    itemNames,
    total,
    status: o.status,
    courier: o.courier_name || "",
    note: o.note || "",
    date,
    time,
    hasLivefish,
  };
}
