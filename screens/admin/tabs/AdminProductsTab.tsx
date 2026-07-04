import { A } from "../../../lib/admin-styles";
import { AInp, AdminToggle } from "../../../components/ui/AdminControls";
import { COLORS } from "../../../theme";
import { Sticker } from "../../../components/ui/Sticker";
import { __style8, __style11, __style29, __style38, __style46, __style50, __style51, __style52, __style53, __style54, __style55, __style56, __style60, __style62, __style63 } from "../admin-panel-shared-styles";

/* Стили, используемые только в этой вкладке (вынесены на верхний уровень модуля,
   чтобы не пересоздавались при каждом рендере). */
const __style57 = { fontSize: 13.5, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } as const;
const __style58 = { display: "flex", gap: 8, marginTop: 3, flexWrap: "wrap" } as const;
const __style59 = { fontSize: 12, fontWeight: 700, color: A.amber } as const;
const __style61 = { background: "none", border: `1px solid ${A.border}`, borderRadius: 7, padding: "3px 9px", fontSize: 11, color: A.soft, cursor: "pointer" } as const;

export function AdminProductsTab({
  filteredProducts,
  productFilter,
  setProductFilter,
  editProduct,
  setEditProduct,
  toggleProduct,
  updateProduct,
  deleteProduct,
  saveProduct,
}: any) {
  return (
        <div style={__style11}>
          <div style={__style52}>
            <div style={__style53}>Товары ({filteredProducts.length})</div>
          </div>

          {/* Фильтр по категории */}
          <div style={__style29}>
            {[["all","Все"],["fish","🐠 Рыбы"],["food","🍽️ Корм"],["equipment","⚙️ Оборудование"],["plant","🌿 Растения"],["low","⚠️ Мало"],["hidden","🚫 Скрытые"]].map(([k, l]) => (
              <button key={k} onClick={() => setProductFilter(k)} style={{
                whiteSpace: "nowrap",
                background: productFilter === k ? A.teal : COLORS.panel,
                color: productFilter === k ? COLORS.bg : A.soft,
                border: `1px solid ${productFilter === k ? A.teal : A.border}`,
                borderRadius: 999, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer",
              }}>{l}</button>
            ))}
          </div>

          {filteredProducts.map(p => {
            const isEdit = editProduct === p.id;
            const lowStock = p.stock <= 3;
            return (
              <div key={p.id} style={{ background: A.card, border: `1px solid ${lowStock && p.active ? A.red + "44" : A.border}`, borderRadius: 14, marginBottom: 10, overflow: "hidden" }}>
                <div style={__style54}>
                  <div style={__style55}>
                    <Sticker e={p.emoji} size={44} />
                    <div style={__style56}>
                      <div style={__style57}>{p.name}</div>
                      <div style={__style58}>
                        <span style={__style59}>{p.price.toLocaleString("ru-RU")} сум</span>
                        <span style={{ fontSize: 11, color: lowStock ? A.red : A.teal }}>📦 {p.stock} шт{lowStock ? " ⚠️" : ""}</span>
                        <span style={__style8}>🛒 {p.orders} продано</span>
                      </div>
                    </div>
                    <div style={__style60}>
                      <AdminToggle value={p.active} onChange={() => toggleProduct(p.id)} />
                      <button onClick={() => setEditProduct(isEdit ? null : p.id)} style={__style61}>
                        {isEdit ? "▲ Свернуть" : "✏️ Ред."}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Редактирование */}
                {isEdit && (
                  <div style={__style38}>
                    <div style={__style62}>
                      <div>
                        <div style={__style46}>Цена (сум)</div>
                        <AInp type="number" value={p.price} onChange={v => updateProduct(p.id, "price", Number(v))} />
                      </div>
                      <div>
                        <div style={__style46}>Остаток (шт)</div>
                        <AInp type="number" value={p.stock} onChange={v => updateProduct(p.id, "stock", Number(v))} />
                      </div>
                      <div>
                        <div style={__style46}>Мин. цена (сум)</div>
                        <AInp type="number" value={p.minPrice} onChange={v => updateProduct(p.id, "minPrice", Number(v))} />
                      </div>
                      <div>
                        <div style={__style46}>👁 Просмотры</div>
                        <AInp type="number" value={p.views} onChange={v => updateProduct(p.id, "views", Number(v))} />
                      </div>
                    </div>
                    <div style={__style63}>
                      <button onClick={saveProduct} style={__style50}>✅ Сохранить</button>
                      <button onClick={() => deleteProduct(p.id)} style={__style51}>🗑 Удалить</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
  );
}
