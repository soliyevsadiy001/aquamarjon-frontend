import { A } from "../../../lib/admin-styles";
import { AInp } from "../../../components/ui/AdminControls";
import { COLORS } from "../../../theme";
import { __style8, __style11, __style38, __style46, __style50, __style51, __style52, __style53, __style54, __style56, __style62, __style63, __style93, __style97, __style115, __style119, __style123 } from "../admin-panel-shared-styles";

/* Стили, используемые только в этой вкладке (вынесены на верхний уровень модуля,
   чтобы не пересоздавались при каждом рендере). */
const __style98 = { display: "flex", gap: 6, marginBottom: 14 } as const;
const __style99 = { display: "flex", alignItems: "center", gap: 10 } as const;
const __style100 = { fontSize: 10.5, color: A.muted, marginTop: 1 } as const;
const __style101 = { display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end" } as const;
const __style102 = { fontSize: 9, color: A.amber, fontWeight: 700 } as const;
const __style103 = { marginTop: 10, background: "#0A1822", borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 } as const;
const __style104 = { background: "none", border: `1px solid ${A.border}`, borderRadius: 7, padding: "3px 8px", fontSize: 11, color: A.soft, cursor: "pointer" } as const;
const __style105 = { display: "flex", gap: 6, marginTop: 10 } as const;
const __style106 = { borderTop: `1px solid ${A.amber}44`, padding: "12px 14px", background: "#1A1400" } as const;
const __style107 = { fontSize: 12, color: A.amber, marginBottom: 10, fontWeight: 600 } as const;
const __style108 = { fontSize: 11, color: A.muted, fontWeight: 400 } as const;
const __style109 = { flex: 1, background: COLORS.panel, color: A.soft, border: `1px solid ${A.border}`, borderRadius: 9, padding: "9px", fontSize: 13, cursor: "pointer" } as const;
const __style110 = { flex: 2, background: A.amber, color: COLORS.bg, border: "none", borderRadius: 9, padding: "9px", fontSize: 13, fontWeight: 700, cursor: "pointer" } as const;
const __style111 = { gridColumn: "1 / -1" } as const;
const __style112 = { display: "flex", gap: 6, flexWrap: "wrap" } as const;
const __style113 = { position: "fixed", inset: 0, background: "rgba(5,10,16,0.85)", zIndex: 300, display: "flex", alignItems: "flex-end" } as const;
const __style114 = { background: COLORS.bg2, width: "100%", borderRadius: "20px 20px 0 0", padding: "20px 20px 40px", maxHeight: "90vh", overflowY: "auto" } as const;
const __style116 = { display: "flex", gap: 8, marginBottom: 14 } as const;
const __style117 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 } as const;
const __style118 = { marginBottom: 16 } as const;
const __style120 = { background: "#0A2520", border: `1px solid ${A.teal}44`, borderRadius: 12, padding: "10px 14px", marginBottom: 14 } as const;
const __style121 = { fontSize: 11, color: A.teal, fontWeight: 700, marginBottom: 4 } as const;
const __style122 = { fontFamily: "monospace", fontSize: 12, color: A.text } as const;

export function AdminAccountsTab({
  accounts,
  accFilter,
  setAccFilter,
  accEditId,
  setAccEditId,
  newAccModal,
  setNewAccModal,
  newAcc,
  setNewAcc,
  resetConfirm,
  setResetConfirm,
  isLoginTaken,
  resetPassword,
  toggleAccount,
  updateAccount,
  deleteAccount,
  addAccount,
  showToast,
}: any) {
  return (
        <div style={__style11}>
          <div style={__style52}>
            <div style={__style53}>
              Аккаунты ({accounts.filter(a => a.role !== "admin").filter(a => accFilter === "all" || a.role === accFilter).length})
            </div>
            <button onClick={() => setNewAccModal(true)} style={__style97}>+ Создать</button>
          </div>

          {/* Фильтр роли */}
          <div style={__style98}>
            {[["all","Все"],["courier","🏍️ Курьеры"],["seller","🏪 Продавцы"]].map(([k, l]) => (
              <button key={k} onClick={() => setAccFilter(k)} style={{
                background: accFilter === k ? A.teal : COLORS.panel,
                color: accFilter === k ? COLORS.bg : A.soft,
                border: `1px solid ${accFilter === k ? A.teal : A.border}`,
                borderRadius: 999, padding: "5px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer",
              }}>{l}</button>
            ))}
          </div>

          {accounts.filter(a => a.role !== "admin").filter(a => accFilter === "all" || a.role === accFilter).map(acc => {
            const isEdit = accEditId === acc.id;
            const isReset = resetConfirm === acc.id;
            // ⚠️ acc.password теперь всегда null, кроме момента сразу после
            // создания аккаунта (см. types.ts на бэкенде/фронте) — постоянного
            // просмотра пароля больше нет, только временный пароль после
            // сброса (acc.tempPass), который виден до первого входа пользователя.
            const dispPass = acc.tempPass ? `⏳ TEMP: ${acc.tempPass}` : "Скрыт · используйте «Сбросить пароль»";
            return (
              <div key={acc.id} style={{ background: A.card, border: `1px solid ${!acc.active ? A.red + "44" : acc.tempPass ? A.amber + "55" : A.border}`, borderRadius: 14, marginBottom: 10, overflow: "hidden" }}>
                {/* Шапка карточки */}
                <div style={__style54}>
                  <div style={__style99}>
                    {/* Аватар */}
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: acc.role === "courier" ? COLORS.panel : "#1A2210", border: `1px solid ${acc.active ? A.teal : A.red}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                      {acc.role === "courier" ? "🏍️" : "🏪"}
                    </div>
                    <div style={__style56}>
                      <div style={__style93}>{acc.name}</div>
                      <div style={__style8}>@{acc.login} · {acc.region}</div>
                      <div style={__style100}>
                        {acc.phone} · Вход: {acc.lastLogin}
                      </div>
                    </div>
                    <div style={__style101}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: acc.active ? A.teal : A.red }}>
                        {acc.active ? "● Активен" : "○ Блок"}
                      </span>
                      {acc.tempPass && <span style={__style102}>⏳ TEMP</span>}
                    </div>
                  </div>

                  {/* Пароль строка */}
                  <div style={__style103}>
                    <span style={__style8}>🔑 Пароль:</span>
                    <span style={{ flex: 1, fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: acc.tempPass ? A.amber : A.muted, letterSpacing: acc.tempPass ? 1 : 0 }}>
                      {dispPass}
                    </span>
                  </div>

                  {/* Кнопки действий */}
                  <div style={__style105}>
                    <button onClick={() => setAccEditId(isEdit ? null : acc.id)} style={{ flex: 1, background: isEdit ? COLORS.border : COLORS.panel, border: `1px solid ${A.border}`, borderRadius: 9, padding: "7px", fontSize: 12, color: A.soft, cursor: "pointer", fontWeight: 600 }}>
                      {isEdit ? "▲ Свернуть" : "✏️ Редакт."}
                    </button>
                    <button onClick={() => setResetConfirm(isReset ? null : acc.id)} style={{ flex: 1, background: isReset ? A.amber + "22" : COLORS.panel, border: `1px solid ${isReset ? A.amber : A.border}`, borderRadius: 9, padding: "7px", fontSize: 12, color: A.amber, cursor: "pointer", fontWeight: 600 }}>
                      🔄 Сбросить пароль
                    </button>
                    <button onClick={() => toggleAccount(acc.id)} style={{ flex: 1, background: acc.active ? COLORS.redBg : COLORS.greenBg, border: `1px solid ${acc.active ? A.red : A.teal}`, borderRadius: 9, padding: "7px", fontSize: 12, color: acc.active ? A.red : A.teal, cursor: "pointer", fontWeight: 600 }}>
                      {acc.active ? "⛔ Блок" : "✅ Активир."}
                    </button>
                  </div>
                </div>

                {/* Подтверждение сброса пароля */}
                {isReset && (
                  <div style={__style106}>
                    <div style={__style107}>
                      ⚠️ Сгенерировать временный пароль для {acc.name}?<br/>
                      <span style={__style108}>Пользователь войдёт с временным паролем и сразу создаст новый.</span>
                    </div>
                    <div style={__style63}>
                      <button onClick={() => setResetConfirm(null)} style={__style109}>Отмена</button>
                      <button onClick={() => resetPassword(acc.id)} style={__style110}>🔄 Да, сбросить</button>
                    </div>
                  </div>
                )}

                {/* Редактирование аккаунта */}
                {isEdit && (
                  <div style={__style38}>
                    <div style={__style62}>
                      <div>
                        <div style={__style46}>Имя / Магазин</div>
                        <AInp value={acc.name} onChange={v => updateAccount(acc.id, "name", v)} />
                      </div>
                      <div>
                        <div style={__style46}>Телефон</div>
                        <AInp value={acc.phone} onChange={v => updateAccount(acc.id, "phone", v)} />
                      </div>
                      <div>
                        <div style={__style46}>Логин</div>
                        <AInp value={acc.login} onChange={v => updateAccount(acc.id, "login", v.toLowerCase().replace(/\s/g, "_"))} />
                      </div>
                      <div>
                        <div style={__style46}>Пароль</div>
                        <div style={{ fontSize: 12, color: A.muted, padding: "9px 0" }}>
                          Меняется только через «🔄 Сбросить пароль» выше
                        </div>
                      </div>
                      <div style={__style111}>
                        <div style={__style46}>Регион</div>
                        <div style={__style112}>
                          {["Ташкент","Самарканд","Андижан","Бухара","Наманган","Фергана"].map(r => (
                            <button key={r} onClick={() => updateAccount(acc.id, "region", r)} style={{ background: acc.region === r ? A.teal + "22" : COLORS.panel, border: `1px solid ${acc.region === r ? A.teal : A.border}`, borderRadius: 8, padding: "5px 10px", fontSize: 11, color: acc.region === r ? A.teal : A.soft, cursor: "pointer" }}>{r}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div style={__style63}>
                      <button onClick={() => { setAccEditId(null); showToast("Сохранено ✅"); }} style={__style50}>✅ Сохранить</button>
                      <button onClick={() => deleteAccount(acc.id)} style={__style51}>🗑 Удалить</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Модалка создания нового аккаунта */}
          {newAccModal && (
            <div style={__style113} onClick={() => setNewAccModal(false)}>
              <div onClick={e => e.stopPropagation()} style={__style114}>
                <div style={__style115}>🔐 Новый аккаунт</div>

                {/* Роль */}
                <div style={__style116}>
                  {[["courier","🏍️ Курьер"],["seller","🏪 Продавец"]].map(([k, l]) => (
                    <button key={k} onClick={() => setNewAcc(a => ({ ...a, role: k }))} style={{ flex: 1, background: newAcc.role === k ? A.teal + "22" : COLORS.panel, border: `1px solid ${newAcc.role === k ? A.teal : A.border}`, borderRadius: 12, padding: "10px", fontSize: 13, color: newAcc.role === k ? A.teal : A.soft, fontWeight: 700, cursor: "pointer" }}>{l}</button>
                  ))}
                </div>

                <div style={__style117}>
                  {[
                    ["name",     newAcc.role === "courier" ? "Имя курьера" : "Название магазина", "Азиз Р."],
                    ["phone",    "Телефон",  "+998 90 ..."],
                    ["login",    "Логин",    "aziz_tashkent"],
                    ["password", "Пароль",   "AZ1234"],
                  ].map(([field, label, ph]) => (
                    <div key={field}>
                      <div style={__style46}>{label}</div>
                      <AInp value={newAcc[field]} onChange={v => setNewAcc(a => ({ ...a, [field]: field === "login" ? v.toLowerCase().replace(/\s/g, "_") : v }))} placeholder={ph} />
                      {field === "login" && newAcc.login && isLoginTaken(newAcc.login) && (
                        <div style={{ fontSize: 11, color: A.red, marginTop: 4 }}>⚠️ Логин уже занят другим аккаунтом</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Регион */}
                <div style={__style118}>
                  <div style={__style119}>Регион</div>
                  <div style={__style112}>
                    {["Ташкент","Самарканд","Андижан","Бухара","Наманган","Фергана"].map(r => (
                      <button key={r} onClick={() => setNewAcc(a => ({ ...a, region: r }))} style={{ background: newAcc.region === r ? A.teal + "22" : COLORS.panel, border: `1px solid ${newAcc.region === r ? A.teal : A.border}`, borderRadius: 8, padding: "6px 12px", fontSize: 12, color: newAcc.region === r ? A.teal : A.soft, cursor: "pointer" }}>{r}</button>
                    ))}
                  </div>
                </div>

                {/* Превью */}
                {newAcc.login && newAcc.password && (
                  <div style={__style120}>
                    <div style={__style121}>✅ Данные для входа:</div>
                    <div style={__style122}>Логин: <b>{newAcc.login}</b></div>
                    <div style={__style122}>Пароль: <b>{newAcc.password}</b></div>
                  </div>
                )}

                <div style={__style63}>
                  <button onClick={() => setNewAccModal(false)} style={__style123}>Отмена</button>
                  <button onClick={addAccount} disabled={!newAcc.name || !newAcc.login || !newAcc.password || isLoginTaken(newAcc.login)}
                    style={{ flex: 2, background: newAcc.name && newAcc.login && newAcc.password && !isLoginTaken(newAcc.login) ? A.teal : COLORS.border, color: newAcc.name && newAcc.login && newAcc.password && !isLoginTaken(newAcc.login) ? COLORS.bg : A.muted, border: "none", borderRadius: 12, padding: "12px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                    ✅ Создать аккаунт
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
  );
}
