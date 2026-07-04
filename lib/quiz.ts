import { FISH_DB } from "../data/fish";
import { QUIZ_EXPERIENCE_OPTIONS, QUIZ_GOAL_OPTIONS, QUIZ_VOLUME_OPTIONS } from "../data/quiz-content";

export function getQuizRecommendations({ volume, experience, goal }) {
  const volOpt = QUIZ_VOLUME_OPTIONS.find(v => v.id === volume);
  const expOpt = QUIZ_EXPERIENCE_OPTIONS.find(e => e.id === experience);
  const goalOpt = QUIZ_GOAL_OPTIONS.find(g => g.id === goal);
  if (!volOpt || !expOpt || !goalOpt) return [];

  return FISH_DB
    .filter(f => {
      const fitsVolume = f.minVolume <= volOpt.max;
      const fitsDifficulty = expOpt.difficulty.includes(f.difficulty);
      const fitsGoal = goalOpt.goals.some(g => f.goal.includes(g));
      return fitsVolume && fitsDifficulty && fitsGoal;
    })
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
}

/* Компонент одного шага квиза */
