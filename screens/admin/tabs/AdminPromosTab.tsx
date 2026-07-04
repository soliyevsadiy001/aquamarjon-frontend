import { A } from "../../../lib/admin-styles";
import { AInp, AdminToggle } from "../../../components/ui/AdminControls";
import { COLORS } from "../../../theme";
import { __style11, __style46, __style53, __style62, __style63, __style97, __style115, __style123 } from "../admin-panel-shared-styles";

/* Стили, используемые только в этой вкладке (вынесены на верхний уровень модуля,
   чтобы не пересоздавались при каждом рендере). */
const __style124 = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 } as const;
const __style125 = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 } as const;
const __style126 = { fontSize: 16, fontWeight: 900, letterSpacing: 1, color: A.amber } as const;
const __style127 = { fontSize: 12, color: A.teal, fontWeight: 700, marginTop: 2 } as const;
const __style128 = { fontSize: 11, color: A.muted, marginBottom: 6 } as const;
const __style129 = { height: 5, background: COLORS.panel, borderRadius: 3, overflow: "hidden", marginBottom: 10 } as const;
const __style130 = { fontSize: 11, color: A.red, marginBottom: 8 } as const;
const __style131 = { background: "none", border: `1px solid ${A.border}`, borderRadius: 8, padding: "5px 12px", fontSize: 11, color: A.red, cursor: "pointer", fontWeight: 600 } as const;
const __style132 = { position: "fixed", inset: 0, background: "rgba(5,10,16,0.8)", zIndex: 300, display: "flex", alignItems: "flex-end" } as const;
const __style133 = { background: COLORS.bg2, width: "100%", borderRadius: "20px 20px 0 0", padding: "20px 20px 36px" } as const;

export function AdminPromosTab({
  promos,
  newPromoModal,
  setNewPromoModal,
  newPromoCode,
  setNewPromoCode,
  newPromoDisc,
  setNewPromoDisc,
  newPromoMax,
  setNewPromoMax,
  newPromoExp,
  setNewPromoExp,
  addPromo,
  togglePromo,
  deletePromo,
}: any) {
  return (
        <div style={__style11}>
          <div style={__style124}>
            <div style={__style53}>Промокоды ({promos.length})</div>
            <button onClick={() => setNewPromoModal(true)} style={__style97}>+ Создать</button>
          </div>

          {promos.map(p => {
            const usePct = p.maxUses > 0 ? Math.min(100, Math.round(p.uses / p.maxUses * 100)) : 0;
            const nearly = usePct >= 80;
            return (
              <div key={p.code} style={{ background: A.card, border: `1px solid ${p.active ? A.border : "#0D1E2C"}`, borderRadius: 14, padding: "14px", marginBottom: 10, opacity: p.active ? 1 : 0.5 }}>
                <div style={__style125}>
                  <div>
                    <div style={__style126}>{p.code}</div>
                    <div style={__style127}>−{p.discount}% скидка</div>
                  </div>
                  <AdminToggle value={p.active} onChange={() => togglePromo(p.code)} />
                </div>
                <div style={__style128}>
                  Использований: {p.uses} / {p.maxUses} · До: {p.expires}
                </div>
                <div style={__style129}>
                  <div style={{ width: usePct + "%", height: "100%", background: nearly ? A.red : A.teal, borderRadius: 3 }} />
                </div>
                {nearly && <div style={__style130}>⚠️ Почти исчерпан — {p.maxUses - p.uses} ост.</div>}
                <button onClick={() => deletePromo(p.code)} style={__style131}>🗑 Удалить</button>
              </div>
            );
          })}

          {/* Модалка создания промокода */}
          {newPromoModal && (
            <div style={__style132} onClick={() => setNewPromoModal(false)}>
              <div onClick={e => e.stopPropagation()} style={__style133}>
                <div style={__style115}>🎁 Новый промокод</div>
                <div style={__style62}>
                  <div>
                    <div style={__style46}>Код</div>
                    <AInp value={newPromoCode} onChange={setNewPromoCode} placeholder="SUMMER25" />
                  </div>
                  <div>
                    <div style={__style46}>Скидка %</div>
                    <AInp type="number" value={newPromoDisc} onChange={setNewPromoDisc} placeholder="10" />
                  </div>
                  <div>
                    <div style={__style46}>Макс. использ.</div>
                    <AInp type="number" value={newPromoMax} onChange={setNewPromoMax} placeholder="100" />
                  </div>
                  <div>
                    <div style={__style46}>Истекает</div>
                    <AInp value={newPromoExp} onChange={setNewPromoExp} placeholder="31.12.2025" />
                  </div>
                </div>
                <div style={__style63}>
                  <button onClick={() => setNewPromoModal(false)} style={__style123}>Отмена</button>
                  <button onClick={addPromo} disabled={!newPromoCode.trim()} style={{ flex: 2, background: newPromoCode.trim() ? A.teal : COLORS.border, color: newPromoCode.trim() ? COLORS.bg : A.muted, border: "none", borderRadius: 12, padding: "12px", fontSize: 15, fontWeight: 700, cursor: newPromoCode.trim() ? "pointer" : "default" }}>✅ Создать</button>
                </div>
              </div>
            </div>
          )}
        </div>
  );
}
