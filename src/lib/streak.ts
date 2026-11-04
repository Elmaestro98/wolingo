import { toDateKey } from "@/lib/dates";

/** Les jours de la semaine, du lundi au dimanche (comme un calendrier français). */
export const WEEK_DAY_LABELS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

export type StreakWeekDay = {
  label: string;
  isToday: boolean;
  /** Une leçon a été faite ce jour-là (il fait partie de la série en cours) */
  isDone: boolean;
};

/**
 * Est-ce la première leçon de la journée ? Si oui, la série vient d'augmenter (ou de commencer) :
 * c'est le moment de la fêter. À appeler AVANT d'enregistrer la leçon.
 */
export function isFirstLessonOfDay(lastActiveKey: string | null, today: Date): boolean {
  return lastActiveKey !== toDateKey(today);
}

/**
 * La semaine en cours (lundi → dimanche), avec les jours de la série cochés.
 * Ex. série de 3 un jeudi : mardi, mercredi et jeudi sont cochés ; vendredi et après, pas encore.
 */
export function getStreakWeek(streakDays: number, today: Date): StreakWeekDay[] {
  // getDay() : 0 = dimanche, 1 = lundi… On décale pour que lundi = 0 et dimanche = 6
  const todayIndex = (today.getDay() + 6) % 7;

  return WEEK_DAY_LABELS.map((label, index) => {
    const daysAgo = todayIndex - index; // > 0 : jour passé ; 0 : aujourd'hui ; < 0 : jour à venir
    return { label, isToday: daysAgo === 0, isDone: daysAgo >= 0 && daysAgo < streakDays };
  });
}
