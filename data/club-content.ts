import { COLORS } from "../theme";
import type { ClubPost } from "../types";

export const CLUB_TABS = [
  { id: "forum",   label: "Форум",   icon: "💬" },
  { id: "exchange", label: "Обмен",  icon: "🔄" },
  { id: "contest", label: "Конкурс", icon: "🏆" },
  { id: "rating",  label: "Рейтинг", icon: "📈" },
  { id: "cities",  label: "Города",  icon: "📍" },
];


export const CLUB_POSTS: ClubPost[] = [
  {
    id: "p1", tab: "forum", author: "Aziz_Breeder", time: "2 часа назад", avatar: "🧑‍🦱",
    tag: { label: "Вопрос", color: COLORS.teal },
    title: "Почему скалярия отказывается от корма уже 3 дня?",
    text: "Рыба активная, плавает нормально, но корм не ест вообще. Параметры воды в норме: pH 7.0, температура 27°C…",
    likes: 14, comments: 7, views: 203,
  },
  {
    id: "p2", tab: "contest", author: "AquaMarjon Official", time: "вчера", avatar: "👑",
    tag: { label: "Конкурс", color: COLORS.amber },
    title: "🏆 Конкурс «Лучший аквариум июня» — 500 000 UZS призовой фонд!",
    text: "Публикуйте фото своего аквариума с хэштегом #AquaMarjon_June. Голосование до 30 июня. Победитель получает сертификат на оборудование…",
    likes: 89, comments: 43, views: null, cta: "Участвовать",
    photo: { emoji: "🪸", color: COLORS.amber },
  },
  {
    id: "p3", tab: "exchange", author: "PlantLover_Samarkand", time: "3 часа назад", avatar: "🌿",
    tag: { label: "Обмен", color: COLORS.green },
    title: "Меняю яванский мох на криптокорину или анубиас",
    text: "Много разросшегося явана, готов отдать пучок за любое теневыносливое растение. Самарканд, могу встретиться лично.",
    likes: 6, comments: 9, views: 88,
  },
  {
    id: "p4", tab: "forum", author: "Malika_T", time: "5 часов назад", avatar: "👩",
    tag: { label: "Совет", color: COLORS.teal },
    title: "Какой обогреватель посоветуете для 60 л с дискусами?",
    text: "Сейчас стоит обогреватель на 50W, температура скачет на 2-3 градуса в холодную ночь. Может, взять мощнее с терморегулятором?",
    likes: 5, comments: 11, views: 130,
  },
  {
    id: "p5", tab: "cities", author: "Тимур (Ташкент)", time: "1 день назад", avatar: "📍",
    tag: { label: "Города", color: COLORS.soft },
    title: "Встреча аквариумистов Ташкента — 5 июля, парк Дружбы народов",
    text: "Собираемся обменяться рыбой и растениями, обсудить локальные особенности воды. Кто в Ташкенте — пишите в комментарии!",
    likes: 22, comments: 18, views: 310,
  },
  {
    id: "p6", tab: "exchange", author: "Rustam_Nukus", time: "2 дня назад", avatar: "🐠",
    tag: { label: "Обмен", color: COLORS.green },
    title: "Отдам мальков гуппи бесплатно — самовывоз, Нукус",
    text: "Развелось слишком много, отдаю по 10-15 штук в добрые руки. Пишите в личку, заберите быстро — а то некуда сажать новых.",
    likes: 9, comments: 4, views: 71,
    photo: { emoji: "🐠", color: COLORS.green },
  },
];


export const POST_PHOTO_EMOJIS = ["🐠", "🐡", "🦈", "🪸", "🌿", "🏔️", "🌊", "👑"];

