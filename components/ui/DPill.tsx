import React from "react";

export interface DPillProps {
  text: React.ReactNode;
  color: string;
}

export const DPill = React.memo(function DPill({ text, color }: DPillProps) {
  return (
    <span style={{ fontSize: 11, background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 999, padding: "2px 9px", fontWeight: 600, whiteSpace: "nowrap" }}>
      {text}
    </span>
  );
});

/* ---- Чек-лист "Задачи на сегодня" + параметры воды (как в карточке аквариума) ---- */
