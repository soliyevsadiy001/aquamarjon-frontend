import React from "react";

export interface AppleEmojiProps {
  e?: string | null;
  size?: number;
  style?: React.CSSProperties;
}

export const AppleEmoji = React.memo(function AppleEmoji({ e, size = 24, style }: AppleEmojiProps) {
  if (!e) return null;
  // Рендерим эмодзи как обычный текстовый символ (системным эмодзи-шрифтом),
  // а не картинкой с внешнего CDN — так подложка всегда прозрачная,
  // без чёрного квадрата за иконкой (баннеры, карточки категорий и т.д.).
  return (
    <span
      style={{
        fontSize: size,
        lineHeight: 1,
        display: "inline-block",
        background: "transparent",
        ...style,
      }}
    >
      {e}
    </span>
  );
});

