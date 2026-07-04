import React, { useEffect, useRef, useState } from "react";
import { COLORS } from "../../theme";
import { aiChat } from "../../lib/api";
import type { CartItem } from "../../types";

/* ---- hoisted static styles (perf: avoid re-allocating on every render) ---- */
const __style1 = {
            position: "fixed", bottom: 104, right: 16, zIndex: 95,
            width: 52, height: 52, borderRadius: "50%",
            background: "linear-gradient(135deg, #00C9B1, #00A896)",
            border: "none", fontSize: 22, cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0,201,177,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "chatPulse 2.5s ease-in-out infinite",
          } as const;
const __style2 = {
          position: "fixed", bottom: 70, right: 0, left: 0,
          zIndex: 130, display: "flex", flexDirection: "column",
          background: COLORS.bg2, borderTop: `1px solid ${COLORS.border}`,
          height: "60vh",
        } as const;
const __style3 = {
            display: "flex", alignItems: "center", gap: 10,
            padding: "12px 16px", borderBottom: `1px solid ${COLORS.border}`,
            background: "#0D2030",
          } as const;
const __style4 = { flex: 1 } as const;
const __style5 = { fontSize: 13, fontWeight: 700 } as const;
const __style6 = { background: "none", border: "none", color: COLORS.muted, fontSize: 18, cursor: "pointer" } as const;
const __style7 = { flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 } as const;
const __style8 = { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 4 } as const;
const __style9 = {
                    background: COLORS.panel, border: `1px solid ${COLORS.border}`,
                    borderRadius: 999, padding: "5px 10px",
                    color: COLORS.soft, fontSize: 11, cursor: "pointer",
                  } as const;
const __style10 = { textAlign: "center", fontSize: 11, color: COLORS.muted, padding: "2px 0" } as const;
const __style11 = { display: "flex", justifyContent: "center" } as const;
const __style12 = { fontSize: 11, color: COLORS.amber } as const;
const __style13 = { display: "flex" } as const;
const __style14 = {
                  background: COLORS.panel, borderRadius: "14px 14px 14px 4px",
                  padding: "10px 14px", fontSize: 18, color: COLORS.muted,
                  animation: "typing 1s infinite",
                } as const;
const __style15 = {
            padding: "10px 12px", borderTop: `1px solid ${COLORS.border}`,
            display: "flex", gap: 8, background: "#0D2030",
          } as const;
const __style16 = {
                flex: 1, background: COLORS.panel, border: `1px solid ${COLORS.border}`,
                borderRadius: 10, padding: "9px 12px",
                color: COLORS.text, fontSize: 13, outline: "none",
              } as const;


export interface AIChatWidgetProps {
  cart: CartItem[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  autoEscalate?: boolean;
}

export function AIChatWidget({ cart, open: openProp, onOpenChange, autoEscalate }: AIChatWidgetProps) {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = (v: boolean) => { onOpenChange ? onOpenChange(v) : setOpenState(v); };
  const [messages, setMessages] = useState([
    { role: "bot", text: "Привет! 🐠 Я Marjon, как могу помочь? Спрашивайте про рыб, уход, совместимость или доставку." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [humanMode, setHumanMode] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const bottomRef = useRef(null);
  const escalated = useRef(false);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (autoEscalate && open && !escalated.current) {
      escalated.current = true;
      escalateToHuman();
    }
  }, [autoEscalate, open]);

  function escalateToHuman() {
    if (humanMode || connecting) return;
    setConnecting(true);
    setMessages(m => [...m, { role: "system", text: "Запрос передан живому специалисту…" }]);
    setTimeout(() => {
      setConnecting(false);
      setHumanMode(true);
      setMessages(m => [...m, { role: "human", text: "Привет! Это Анна, специалист AquaMarjon 👋 Я на связи и помогу разобраться. Опишите ситуацию подробнее." }]);
    }, 1400);
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(m => [...m, { role: "user", text: userMsg }]);
    setLoading(true);

    const cartSummary = cart.filter(f => f.type === "fish").map(f => f.name).join(", ") || "пока пусто";
    const humanSystem = `Ты — Анна, живой специалист интернет-магазина аквариумных рыб AquaMarjon (Узбекистан), который только что подключился к чату с клиентом вместо AI-бота. Отвечай как человек: тепло, конкретно, можешь задавать уточняющие вопросы, иногда используй разговорные обороты на русском. Не упоминай, что ты AI. В корзине покупателя: ${cartSummary}.`;
    const botSystem = `Ты — Marjon, помощник интернет-магазина аквариумных рыб AquaMarjon (Узбекистан). Не упоминай, что ты AI или бот, представляйся просто как Marjon. Отвечай коротко, дружелюбно, на русском языке. Используй эмодзи умеренно. В корзине покупателя сейчас: ${cartSummary}. Помогай с выбором рыб, уходом, совместимостью, вопросами о доставке. Если вопрос сложный (болезнь рыбы, спорный заказ, жалоба) — предложи позвать живого консультанта.`;
    try {
      // Раньше здесь был прямой fetch на https://api.anthropic.com — вызывался
      // с фронта, без ключа (в проде просто падал 401/CORS), а с ключом утёк бы
      // в клиентский бандл. Теперь зовём свой бэкенд, ключ живёт там (см. lib/api.ts).
      const reply = await aiChat(humanMode ? humanSystem : botSystem, userMsg);
      setMessages(m => [...m, { role: humanMode ? "human" : "bot", text: reply || "Упс, что-то пошло не так. Попробуйте ещё раз." }]);
    } catch {
      setMessages(m => [...m, { role: humanMode ? "human" : "bot", text: "Нет соединения. Попробуйте позже." }]);
    }
    setLoading(false);
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={__style1}
        >💬</button>
      )}

      {/* Chat panel */}
      {open && (
        <div style={__style2}>
          {/* Chat header */}
          <div style={__style3}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: humanMode ? "#F0A93C22" : "#00C9B122", border: `1px solid ${humanMode ? "#F0A93C44" : "#00C9B144"}`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
            }}>{humanMode ? "👩" : "🐠"}</div>
            <div style={__style4}>
              <div style={__style5}>{humanMode ? "Анна · специалист AquaMarjon" : "Marjon · помощник AquaMarjon"}</div>
              <div style={{ fontSize: 11, color: connecting ? COLORS.amber : COLORS.teal }}>
                {connecting ? "● Подключаем специалиста…" : "● Онлайн"}
              </div>
            </div>
            {!humanMode && (
              <button
                onClick={escalateToHuman}
                disabled={connecting}
                title="Позвать живого консультанта"
                style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "5px 9px", color: COLORS.soft, fontSize: 11, cursor: connecting ? "default" : "pointer", whiteSpace: "nowrap" }}
              >👤 Консультант</button>
            )}
            <button onClick={() => setOpen(false)} style={__style6} aria-label="Закрыть">✕</button>
          </div>

          {/* Messages */}
          <div style={__style7}>
            {/* Quick prompts */}
            {messages.length === 1 && (
              <div style={__style8}>
                {["Как держать дискуса?", "Когда привезут?", "Какой фильтр нужен?", "Гарантия на рыб?"].map(q => (
                  <button key={q} onClick={() => { setInput(q); }} style={__style9}>{q}</button>
                ))}
              </div>
            )}
            {messages.map((m, i) => {
              if (m.role === "system") {
                return (
                  <div key={i} style={__style10}>
                    {m.text}
                  </div>
                );
              }
              return (
                <div key={i} style={{
                  display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                }}>
                  <div style={{
                    maxWidth: "80%",
                    background: m.role === "user" ? COLORS.teal : m.role === "human" ? "#2A1F0A" : COLORS.panel,
                    color: m.role === "user" ? COLORS.bg : COLORS.text,
                    border: m.role === "human" ? "1px solid #F0A93C44" : "none",
                    borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                    padding: "9px 12px",
                    fontSize: 13, lineHeight: 1.55,
                  }}>{m.text}</div>
                </div>
              );
            })}
            {connecting && (
              <div style={__style11}>
                <div style={__style12}>🔄 Ищем свободного специалиста…</div>
              </div>
            )}
            {loading && (
              <div style={__style13}>
                <div style={__style14}>···</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={__style15}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Задайте вопрос..."
              style={__style16}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                background: input.trim() ? COLORS.teal : COLORS.panel,
                color: input.trim() ? COLORS.bg : COLORS.muted,
                border: "none", borderRadius: 10, padding: "9px 14px",
                fontSize: 15, cursor: input.trim() ? "pointer" : "default",
                fontWeight: 700,
              }}
            >→</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(0,201,177,0.5); }
          50% { box-shadow: 0 4px 28px rgba(0,201,177,0.8); transform: scale(1.05); }
        }
        @keyframes typing {
          0%, 100% { opacity: 0.3; } 50% { opacity: 1; }
        }
      `}</style>
    </>
  );
}

/* ---------- Catalog screen ---------- */
