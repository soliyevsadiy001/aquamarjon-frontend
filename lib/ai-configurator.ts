import { FISH_DB } from "../data/fish";

export function buildAiPlan({ volume, goal, experience, budget }) {
  // фильтр по объёму и сложности
  let pool = FISH_DB.filter((f) => f.minVolume <= volume);
  if (experience === "easy") pool = pool.filter((f) => f.difficulty !== "hard");
  if (experience !== "hard") pool = pool.filter((f) => f.difficulty !== "hard" || experience === "hard");

  // фильтр по цели — если ничего не подошло, ослабляем фильтр
  let byGoal = pool.filter((f) => f.goal.includes(goal));
  if (byGoal.length === 0) byGoal = pool;

  // убираем несовместимые пары — простая greedy-сборка
  const picked = [];
  for (const f of byGoal.sort((a, b) => a.price - b.price)) {
    const conflict = picked.some(
      (p) => f.avoid.includes(p.id) || p.avoid.includes(f.id)
    );
    if (!conflict) picked.push(f);
    if (picked.length >= 3) break;
  }

  // подгон под бюджет — считаем стайные количества (мелкие виды по 6 шт для красоты)
  const withQty = picked.map((f) => {
    const qty = f.size === "small" ? 6 : 1;
    return { ...f, qty };
  });

  let total = withQty.reduce((s, f) => s + f.price * f.qty, 0);
  // если перебор бюджета — урезаем количество мелких рыб
  while (total > budget && withQty.some((f) => f.qty > 2)) {
    const big = withQty.find((f) => f.qty > 2);
    big.qty -= 1;
    total = withQty.reduce((s, f) => s + f.price * f.qty, 0);
  }

  const equipment = [
    { name: `Аквариум ${volume} л`, price: Math.round(volume * 900) },
    { name: "Фильтр + компрессор", price: 85000 },
    { name: "Обогреватель с термостатом", price: 65000 },
    { name: "Грунт + декор", price: 40000 },
  ];
  const equipTotal = equipment.reduce((s, e) => s + e.price, 0);

  return { fish: withQty, fishTotal: total, equipment, equipTotal, grandTotal: total + equipTotal };
}

