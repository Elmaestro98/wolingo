/**
 * Transforme une date en clé « AAAA-MM-JJ » (ex. "2026-10-20"), à l'heure du téléphone.
 * Deux moments du même jour donnent la même clé : pratique pour comparer des JOURS.
 */
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() compte à partir de 0 !
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Clé du jour situé `days` jours plus tard (ex. addDaysToKey(…20 octobre, 3) → "2026-10-23"). */
export function addDaysToKey(date: Date, days: number): string {
  const later = new Date(date);
  later.setDate(date.getDate() + days); // gère tout seul les changements de mois et d'année
  return toDateKey(later);
}

/** Clé du jour d'avant (ex. "2026-10-19" pour "2026-10-20"). */
export function getYesterdayKey(today: Date): string {
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1); // gère tout seul les changements de mois et d'année
  return toDateKey(yesterday);
}

/**
 * Nouvelle série après une leçon terminée aujourd'hui.
 * - Déjà une leçon aujourd'hui → la série ne bouge pas
 * - Dernière leçon hier → +1
 * - Sinon (première fois, ou jour sauté) → la série repart à 1
 */
export function getStreakAfterLesson(
  currentStreak: number,
  lastActiveKey: string | null,
  today: Date,
): number {
  if (lastActiveKey === toDateKey(today)) return currentStreak;
  if (lastActiveKey === getYesterdayKey(today)) return currentStreak + 1;
  return 1;
}

/**
 * Série à AFFICHER aujourd'hui : si la dernière leçon date d'avant-hier ou plus, la série est cassée (0).
 * (On ne la remet pas à zéro dans la sauvegarde : c'est un simple calcul pour l'affichage.)
 */
export function getDisplayedStreak(streak: number, lastActiveKey: string | null, today: Date): number {
  if (lastActiveKey === toDateKey(today) || lastActiveKey === getYesterdayKey(today)) return streak;
  return 0;
}
