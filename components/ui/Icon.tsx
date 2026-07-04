import React from "react";
import type { IconName } from "../../types";

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const Icon = React.memo(function Icon({ name, size = 20, color = "currentColor", strokeWidth = 1.8 }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  const paths = {
    home: (
      <svg {...common}>
        <path d="M3.5 11.5 12 4l8.5 7.5" />
        <path d="M5.5 10v9a1 1 0 0 0 1 1H10v-5.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V20h3.5a1 1 0 0 0 1-1v-9" />
      </svg>
    ),
    fish: (
      <svg {...common}>
        <path d="M3 12c3-4.5 8-6.5 13-5 2 .6 4 2 5 5-1 3-3 4.4-5 5-5 1.5-10-.5-13-5Z" />
        <circle cx="16" cy="10.6" r="0.9" fill={color} stroke="none" />
        <path d="M18.5 8.5c1.5-1.8 2.8-2.2 2.5-.3M18.5 15.5c1.5 1.8 2.8 2.2 2.5.3" />
      </svg>
    ),
    cart: (
      <svg {...common}>
        <path d="M4 5h2l1.6 10.2a1.8 1.8 0 0 0 1.8 1.5h7.4a1.8 1.8 0 0 0 1.8-1.5L20 8H7" />
        <circle cx="10" cy="20" r="1.15" fill={color} stroke="none" />
        <circle cx="17" cy="20" r="1.15" fill={color} stroke="none" />
      </svg>
    ),
    doctor: (
      <svg {...common}>
        <path d="M12 21c-4.5-2.7-8-6-8-9.8C4 8.1 6.1 6 8.7 6c1.5 0 2.7.7 3.3 1.8C12.6 6.7 13.8 6 15.3 6 17.9 6 20 8.1 20 11.2c0 3.8-3.5 7.1-8 9.8Z" />
        <path d="M9.5 12h1.4l.7-1.6.9 3.2.7-1.6h1.3" />
      </svg>
    ),
    ai: (
      <svg {...common}>
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
        <circle cx="12" cy="12" r="3.2" />
      </svg>
    ),
    person: (
      <svg {...common}>
        <circle cx="12" cy="8" r="3.6" />
        <path d="M5 20c1-3.8 4-5.8 7-5.8s6 2 7 5.8" />
      </svg>
    ),
    aquarium: (
      <svg {...common}>
        <rect x="3.5" y="6" width="17" height="12" rx="1.6" />
        <path d="M3.5 10.5c1.8 1 3.4-1 5.2 0s3.4 1 5.2 0 3.4-1 5.9 0" />
        <path d="M8 6V4M16 6V4" />
      </svg>
    ),
    box: (
      <svg {...common}>
        <path d="M3.5 8 12 4l8.5 4-8.5 4-8.5-4Z" />
        <path d="M3.5 8v8.2c0 .4.2.7.6.9L12 20l7.9-2.9c.4-.2.6-.5.6-.9V8" />
        <path d="M12 12v8" />
      </svg>
    ),
    heart: (
      <svg {...common}>
        <path d="M12 20.5C6 16.8 3 13.4 3 9.8 3 7.2 5 5 7.6 5c1.7 0 3.2.9 4.4 2.6C13.2 5.9 14.7 5 16.4 5 19 5 21 7.2 21 9.8c0 3.6-3 7-9 10.7Z" />
      </svg>
    ),
    repeat: (
      <svg {...common}>
        <path d="M4 12a8 8 0 0 1 13.7-5.7L20 8" />
        <path d="M20 4v4h-4" />
        <path d="M20 12a8 8 0 0 1-13.7 5.7L4 16" />
        <path d="M4 20v-4h4" />
      </svg>
    ),
    gift: (
      <svg {...common}>
        <rect x="3.5" y="9.5" width="17" height="10" rx="1.2" />
        <path d="M3.5 9.5h17M12 9.5V20" />
        <path d="M12 9.5c-2-3.2-6-3.2-6-.8 0 1 1 .8 2.5.8H12ZM12 9.5c2-3.2 6-3.2 6-.8 0 1-1 .8-2.5.8H12Z" />
      </svg>
    ),
    chevron: (
      <svg {...common}>
        <path d="M9 5.5 15.5 12 9 18.5" />
      </svg>
    ),
    back: (
      <svg {...common}>
        <path d="M15 5.5 8.5 12 15 18.5" />
      </svg>
    ),
    settings: (
      <svg {...common}>
        <circle cx="12" cy="12" r="2.7" />
        <path d="M12 4.2v2M12 17.8v2M19.8 12h-2M6.2 12h-2M17.4 6.6l-1.4 1.4M8 16l-1.4 1.4M17.4 17.4 16 16M8 8 6.6 6.6" />
      </svg>
    ),
    link: (
      <svg {...common}>
        <path d="M10 14a4.2 4.2 0 0 0 6 0l2.5-2.5a4.2 4.2 0 0 0-6-6L11 6.9" />
        <path d="M14 10a4.2 4.2 0 0 0-6 0L5.5 12.5a4.2 4.2 0 0 0 6 6L13 17.1" />
      </svg>
    ),
    group: (
      <svg {...common}>
        <circle cx="9" cy="8.3" r="2.8" />
        <path d="M3.3 19c.8-3.1 3-4.7 5.7-4.7s4.9 1.6 5.7 4.7" />
        <circle cx="17" cy="9" r="2.2" />
        <path d="M15.6 14.6c2.2.2 3.7 1.7 4.3 4.4" />
      </svg>
    ),
    globe: (
      <svg {...common}>
        <circle cx="12" cy="12" r="8.3" />
        <path d="M3.7 12h16.6M12 3.7c2.2 2.2 3.3 5.2 3.3 8.3s-1.1 6.1-3.3 8.3c-2.2-2.2-3.3-5.2-3.3-8.3S9.8 5.9 12 3.7Z" />
      </svg>
    ),
    upgrade: (
      <svg {...common}>
        <circle cx="12" cy="12" r="8.3" />
        <path d="M12 16V8.2M8.4 11.6 12 8l3.6 3.6" />
      </svg>
    ),
    bell: (
      <svg {...common}>
        <path d="M6 10.5a6 6 0 0 1 12 0c0 3.6 1 5 2 6.2H4c1-1.2 2-2.6 2-6.2Z" />
        <path d="M10 19.5a2.1 2.1 0 0 0 4 0" />
      </svg>
    ),
    search: (
      <svg {...common}>
        <circle cx="10.8" cy="10.8" r="6.3" />
        <path d="M19.5 19.5 15.5 15.5" />
      </svg>
    ),
    pin: (
      <svg {...common}>
        <path d="M12 21s6.5-6.1 6.5-11.2A6.5 6.5 0 0 0 5.5 9.8C5.5 14.9 12 21 12 21Z" />
        <circle cx="12" cy="9.6" r="2.1" />
      </svg>
    ),
    star: (
      <svg {...common}>
        <path d="M12 3.7 14.4 9l5.9.6-4.4 3.9 1.3 5.8L12 16.2 6.8 19.3l1.3-5.8-4.4-3.9L9.6 9 12 3.7Z" />
      </svg>
    ),
    close: (
      <svg {...common}>
        <path d="M6 6l12 12M18 6 6 18" />
      </svg>
    ),
    plus: (
      <svg {...common}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
    camera: (
      <svg {...common}>
        <path d="M4 8.3h3l1.3-2h7.4l1.3 2h3v10.4H4Z" />
        <circle cx="12" cy="13.3" r="3.3" />
      </svg>
    ),
    edit: (
      <svg {...common}>
        <path d="M5 19.2 5.6 15.7 15.6 5.7a1.7 1.7 0 0 1 2.4 0l0.3 0.3a1.7 1.7 0 0 1 0 2.4L8.3 18.4 5 19.2Z" />
      </svg>
    ),
    chart: (
      <svg {...common}>
        <path d="M4.5 20V10M12 20V4M19.5 20v-7" />
      </svg>
    ),
    truck: (
      <svg {...common}>
        <path d="M3 7h10v9H3z" />
        <path d="M13 10.5h4.2L20 13.5V16h-7z" />
        <circle cx="7" cy="18.3" r="1.6" />
        <circle cx="16.7" cy="18.3" r="1.6" />
      </svg>
    ),
    water: (
      <svg {...common}>
        <path d="M12 3.7c2.7 3.6 5.3 7.2 5.3 10.4a5.3 5.3 0 0 1-10.6 0c0-3.2 2.6-6.8 5.3-10.4Z" />
      </svg>
    ),
  };
  return paths[name] || null;
});

/* ============================================================
   🍎 AppleEmoji / Sticker / IconBadge — единая система "цветных
   квадратиков" для всего приложения:
   - IconBadge — квадрат с градиентной заливкой и белой line-иконкой
     (SF Symbols-подобный стиль), для пунктов меню и навигации.
   - Sticker — квадрат с тёмной подложкой и "живым" эмодзи-стикером
     (в стиле iOS/iPhone), для карточек контента: рыбы, заказы,
     достижения, задания, уведомления.
   AppleEmoji рендерит эмодзи именно в апрлловском графическом стиле
   (через emojicdn c параметром style=apple), а не в том виде, как
   его отрисовывает ОС пользователя — с аккуратным откатом на обычный
   текстовый эмодзи, если картинка не загрузилась (нет сети и т.п.).
   ============================================================ */
