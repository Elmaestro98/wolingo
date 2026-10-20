/**
 * PROVISOIRE : fausse progression pour construire l'écran Parcours.
 * Plus tard, ces valeurs viendront de la base SQLite (leçons terminées, XP, série…).
 */
export const DEMO_PROGRESS = {
  /** Leçons terminées → nombre d'étoiles obtenues (1 à 3) */
  completedLessons: { "u1-l1": 3, "u1-l2": 2 } as Record<string, number>,
  totalXp: 320,
  /** Jours consécutifs avec au moins une leçon */
  streakDays: 5,
  hearts: 5,
  /** Minutes d'apprentissage aujourd'hui */
  minutesToday: 6,
};
