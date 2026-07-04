import React from "react";
import { GRADIENTS } from "../../theme";
import type { IconName } from "../../types";
import { Icon } from "./Icon";

export interface IconBadgeProps {
  icon: IconName;
  size?: number;
  grad?: string;
  iconSize?: number;
  color?: string;
}

export const IconBadge = React.memo(function IconBadge({ icon, size = 34, grad = GRADIENTS.tealPrimary, iconSize, color = "#fff" }: IconBadgeProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.29),
        background: grad,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color,
      }}
    >
      <Icon name={icon} size={iconSize ?? Math.round(size * 0.53)} />
    </div>
  );
});

/* ============================================================
   🧯 ErrorBoundary — страховка от белого экрана
   Ловит любую непойманную ошибку рендера (например, из-за
   неожиданной формы данных, восстановленных из localStorage
   после обновления приложения) и показывает аккуратный экран
   вместо падения всего Mini App.
   ============================================================ */
