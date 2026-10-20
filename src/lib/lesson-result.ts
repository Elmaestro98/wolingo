/** XP par exercice réussi (cahier des charges : 10 XP). */
export const XP_PER_EXERCISE = 10;
/** Bonus pour une leçon sans faute (cahier des charges : 20 XP). */
export const PERFECT_LESSON_BONUS = 20;

export type LessonResult = {
  xp: number;
  /** Précision entre 0 et 1 (0.92 = 92 %) */
  accuracy: number;
  /** 1 à 3 étoiles */
  stars: number;
  /** Durée arrondie, au moins 1 minute */
  minutes: number;
};

/**
 * Calcule le résultat d'une leçon à partir de ce qui s'est passé.
 * Fonction pure : aucune mémoire, aucun affichage ; les mêmes entrées donnent toujours le même résultat.
 */
export function computeLessonResult(correctCount: number, mistakeCount: number, durationMs: number): LessonResult {
  const isPerfect = mistakeCount === 0;
  const attempts = correctCount + mistakeCount;
  const accuracy = attempts === 0 ? 1 : correctCount / attempts;

  let stars = 1;
  if (isPerfect) stars = 3;
  else if (accuracy >= 0.7) stars = 2;

  return {
    xp: correctCount * XP_PER_EXERCISE + (isPerfect ? PERFECT_LESSON_BONUS : 0),
    accuracy,
    stars,
    minutes: Math.max(1, Math.round(durationMs / 60_000)), // 60 000 ms = 1 minute
  };
}
