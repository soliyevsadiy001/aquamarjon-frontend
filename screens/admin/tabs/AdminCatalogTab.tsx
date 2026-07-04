import { A } from "../../../lib/admin-styles";
import { COLORS } from "../../../theme";
import { AppleEmoji } from "../../../components/ui/AppleEmoji";
import { FISH_DB_BASE, getSpeciesVariants, speciesShortName } from "../../../data/fish";
import { diaryPluralRu } from "../../../lib/diary-stats";
import { __style11 } from "../admin-panel-shared-styles";

/* Стили, используемые только в этой вкладке (вынесены на верхний уровень модуля,
   чтобы не пересоздавались при каждом рендере). */
const __style64 = { fontSize: 14, fontWeight: 700, marginBottom: 4 } as const;
const __style65 = { fontSize: 12.5, color: A.muted, marginBottom: 14, lineHeight: 1.5 } as const;
const __style66 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } as const;
const __style67 = {
                      background: A.card, border: `1px solid ${A.border}`, borderRadius: 14, padding: "12px", cursor: "pointer",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textAlign: "center",
                    } as const;
const __style68 = { fontSize: 12.5, fontWeight: 700 } as const;
const __style69 = { background: "none", border: "none", color: A.soft, fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 12 } as const;
const __style70 = { fontSize: 15, fontWeight: 800, marginBottom: 4 } as const;
const __style71 = { fontSize: 12, color: A.muted, marginBottom: 16 } as const;
const __style72 = { border: `1px dashed ${A.border}`, borderRadius: 14, padding: "18px", textAlign: "center", color: A.muted, fontSize: 13, marginBottom: 14 } as const;
const __style73 = { background: A.card, border: `1px solid ${A.border}`, borderRadius: 14, padding: "14px", marginBottom: 12 } as const;
const __style74 = { display: "flex", gap: 12, alignItems: "center", marginBottom: 12 } as const;
const __style75 = { cursor: "pointer", flexShrink: 0 } as const;
const __style76 = { display: "none" } as const;
const __style77 = { width: 56, height: 56, borderRadius: 12, background: "#0A1620", border: `1px dashed ${A.border}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" } as const;
const __style78 = { width: "100%", height: "100%", objectFit: "cover" } as const;
const __style79 = { fontSize: 11, color: A.muted, textAlign: "center" } as const;
const __style80 = { flex: 1, background: COLORS.panel, border: `1px solid ${A.border}`, borderRadius: 10, padding: "9px 12px", color: A.text, fontSize: 13, outline: "none" } as const;
const __style81 = { background: "none", border: `1px solid ${A.red}`, color: A.red, borderRadius: 8, padding: "8px 10px", fontSize: 12, cursor: "pointer", flexShrink: 0 } as const;
const __style82 = { fontSize: 11.5, color: A.soft, marginBottom: 6, fontWeight: 600 } as const;
const __style83 = { display: "flex", gap: 6, marginBottom: 6 } as const;
const __style84 = { flex: 1, background: COLORS.panel, border: `1px solid ${A.border}`, borderRadius: 8, padding: "7px 10px", color: A.text, fontSize: 12.5, outline: "none" } as const;
const __style85 = { background: "none", border: `1px dashed ${A.border}`, color: A.soft, borderRadius: 8, padding: "6px 10px", fontSize: 12, cursor: "pointer", marginTop: 2 } as const;
const __style86 = { width: "100%", background: COLORS.panel, border: `1px dashed ${A.teal}`, color: A.teal, borderRadius: 12, padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 16 } as const;
const __style87 = { width: "100%", background: A.teal, color: COLORS.bg, border: "none", borderRadius: 12, padding: "13px", fontSize: 15, fontWeight: 800, cursor: "pointer" } as const;

export function AdminCatalogTab({
  catalogSpeciesId,
  setCatalogSpeciesId,
  catalogDraft,
  setCatalogDraft,
  openCatalogSpecies,
  addCatalogVariant,
  updateCatalogVariant,
  deleteCatalogVariant,
  addCatalogSize,
  updateCatalogSize,
  deleteCatalogSize,
  handleCatalogPhoto,
  saveCatalogDraft,
}: any) {
  return (
        <div style={__style11}>
          {!catalogSpeciesId && (
            <>
              <div style={__style64}>Каталог рыб по видам</div>
              <div style={__style65}>
                Выберите вид, чтобы завести карточки-варианты (окрас/порода) с фото и размерами/ценами. Продавцы смогут только выбирать готовую карточку и указывать остаток.
              </div>
              <div style={__style66}>
                {FISH_DB_BASE.map((base) => {
                  const variants = getSpeciesVariants(base.id);
                  const n = variants ? variants.length : 0;
                  return (
                    <div key={base.id} onClick={() => openCatalogSpecies(base.id)} style={__style67}>
                      <AppleEmoji e={base.img} size={34} />
                      <div style={__style68}>{speciesShortName(base)}</div>
                      <div style={{ fontSize: 11, color: n > 0 ? A.teal : A.muted, fontWeight: n > 0 ? 700 : 400 }}>
                        {n > 0 ? `${n} ${diaryPluralRu(n, "карточка", "карточки", "карточек")}` : "нет карточек"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {catalogSpeciesId && catalogDraft && (
            <>
              <button onClick={() => { setCatalogSpeciesId(null); setCatalogDraft(null); }} style={__style69}>← Все виды</button>
              <div style={__style70}>
                {(() => { const b = FISH_DB_BASE.find(b => b.id === catalogSpeciesId); return b ? speciesShortName(b) : ""; })()}
              </div>
              <div style={__style71}>
                Карточки этого вида: фото, название, размеры (см) и цена за каждый размер.
              </div>

              {catalogDraft.length === 0 && (
                <div style={__style72}>
                  У этого вида пока нет карточек-вариантов. Добавьте первую — иначе в каталоге останется одна стандартная карточка вида.
                </div>
              )}

              {catalogDraft.map((v) => (
                <div key={v.id} style={__style73}>
                  <div style={__style74}>
                    <label style={__style75}>
                      <input type="file" accept="image/*" style={__style76} onChange={(e) => handleCatalogPhoto(v.id, e.target.files?.[0])} />
                      <div style={__style77}>
                        {v.photo ? <img src={v.photo} alt={v.name || "Фото карточки"} style={__style78} /> : <span style={__style79}>📷 фото</span>}
                      </div>
                    </label>
                    <input value={v.name} onChange={(e) => updateCatalogVariant(v.id, "name", e.target.value)} placeholder="Название карточки (окрас/порода)"
                      style={__style80} />
                    <button onClick={() => deleteCatalogVariant(v.id)} style={__style81}>🗑</button>
                  </div>

                  <div style={__style82}>Размеры и цены</div>
                  {v.sizes.map((s) => (
                    <div key={s.id} style={__style83}>
                      <input value={s.cm} onChange={(e) => updateCatalogSize(v.id, s.id, "cm", e.target.value)} placeholder="см, напр. 3–4"
                        style={__style84} />
                      <input type="number" value={s.price} onChange={(e) => updateCatalogSize(v.id, s.id, "price", e.target.value)} placeholder="Цена, сум"
                        style={__style84} />
                      <button onClick={() => deleteCatalogSize(v.id, s.id)} disabled={v.sizes.length <= 1} style={{ background: "none", border: `1px solid ${A.border}`, color: v.sizes.length <= 1 ? A.muted : A.soft, borderRadius: 8, padding: "0 10px", fontSize: 13, cursor: v.sizes.length <= 1 ? "default" : "pointer" }} aria-label="Удалить размер">✕</button>
                    </div>
                  ))}
                  <button onClick={() => addCatalogSize(v.id)} style={__style85}>+ Размер</button>
                </div>
              ))}

              <button onClick={addCatalogVariant} style={__style86}>
                + Добавить карточку вида
              </button>

              <button onClick={saveCatalogDraft} style={__style87}>
                💾 Сохранить и обновить каталог
              </button>
            </>
          )}
        </div>
  );
}
