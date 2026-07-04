export const GOAL_OPTIONS = [
  { id: "beauty", icon: "🎨", label: "Для красоты", hint: "Эффектный, яркий аквариум" },
  { id: "breeding", icon: "🐣", label: "Для размножения", hint: "Разводить и наблюдать потомство" },
  { id: "pets", icon: "❤️", label: "Как питомцы", hint: "Узнают хозяина, привязанность" },
  { id: "kids", icon: "🧒", label: "Для детей", hint: "Просто, безопасно, неприхотливо" },
];


export const EXPERIENCE_OPTIONS = [
  { id: "easy", label: "Новичок", hint: "Первый аквариум" },
  { id: "medium", label: "Есть опыт", hint: "Уже держал рыб" },
  { id: "hard", label: "Профи", hint: "Готов к сложным видам" },
];


export const QUIZ_VOLUME_OPTIONS = [
  { id: "nano",   label: "Нано",     sub: "до 40 л",   icon: "🫙", min: 0,   max: 40  },
  { id: "small",  label: "Маленький",sub: "40–80 л",   icon: "🪣", min: 40,  max: 80  },
  { id: "medium", label: "Средний",  sub: "80–150 л",  icon: "🐟", min: 80,  max: 150 },
  { id: "large",  label: "Большой",  sub: "150–300 л", icon: "🌊", min: 150, max: 300 },
  { id: "xl",     label: "Огромный", sub: "300+ л",    icon: "🌍", min: 300, max: 9999},
];


export const QUIZ_EXPERIENCE_OPTIONS = [
  { id: "zero",   label: "Первый раз",   sub: "Никогда не держал рыб",        icon: "🐣", difficulty: ["easy"] },
  { id: "some",   label: "Немного есть", sub: "Держал, но давно",             icon: "🌱", difficulty: ["easy","medium"] },
  { id: "medium", label: "Опытный",      sub: "Аквариум уже есть",            icon: "🎓", difficulty: ["easy","medium","hard"] },
  { id: "expert", label: "Профи",        sub: "Несколько аквариумов",         icon: "👑", difficulty: ["easy","medium","hard"] },
];


export const QUIZ_GOAL_OPTIONS = [
  { id: "beauty",   label: "Красота",     sub: "Яркие, эффектные рыбы",        icon: "✨", goals: ["beauty"] },
  { id: "pets",     label: "Питомец",     sub: "Умная, узнаёт хозяина",        icon: "❤️", goals: ["pets"] },
  { id: "kids",     label: "Для детей",   sub: "Неприхотливая и безопасная",   icon: "🧒", goals: ["kids","pets"] },
  { id: "breeding", label: "Разведение",  sub: "Хочу получать потомство",      icon: "🐣", goals: ["breeding","beauty"] },
  { id: "design",   label: "Дизайн",      sub: "Аквариум как арт-объект",      icon: "🎨", goals: ["beauty"] },
];

/* Алгоритм подбора рыб по ответам квиза */
