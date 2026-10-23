import { LESSONS, type Lesson, type LessonStep } from "@/content/lessons";
import { addDaysToKey, toDateKey } from "@/lib/dates";

/** Écarts de révision (cahier des charges) : J+1, puis J+3, puis J+7, puis l'exercice est maîtrisé. */
export const REVIEW_INTERVALS_DAYS = [1, 3, 7];

/** Nombre maximum d'exercices dans une séance de révision (cahier des charges : 10). */
export const REVIEW_SESSION_SIZE = 10;

/** L'id spécial de la séance de révision dans l'adresse : /lesson/review */
export const REVIEW_SESSION_ID = "review";

/** Un exercice à revoir : quand, et à quel palier de révision il en est. */
export type ReviewItem = {
  /** Jour où il doit revenir (« AAAA-MM-JJ ») */
  dueDateKey: string;
  /** Position dans REVIEW_INTERVALS_DAYS (0 = J+1, 1 = J+3, 2 = J+7) */
  intervalIndex: number;
};

/** Tous les exercices à revoir, rangés par référence (« u1-l3#4 » = leçon u1-l3, étape n°4). */
export type ReviewItems = Record<string, ReviewItem>;

/**
 * Référence stable d'un exercice : « idDeLaLeçon#position ».
 * On cherche l'étape dans le contenu ; ça marche aussi pour le quiz, qui réutilise les mêmes étapes.
 */
export function getStepRef(step: LessonStep): string | undefined {
  for (const lesson of Object.values(LESSONS)) {
    const index = lesson.steps.indexOf(step); // indexOf compare les objets eux-mêmes (même étape)
    if (index !== -1) return `${lesson.id}#${index}`;
  }
  return undefined;
}

/** L'étape correspondant à une référence (« u1-l3#4 »), ou undefined si le contenu a changé. */
export function getStepFromRef(ref: string): LessonStep | undefined {
  const [lessonId, index] = ref.split("#"); // "u1-l3#4" → ["u1-l3", "4"]
  return LESSONS[lessonId]?.steps[Number(index)];
}

/** Après une erreur (en leçon ou en révision) : l'exercice revient DEMAIN, au premier palier. */
export function scheduleAfterMistake(today: Date): ReviewItem {
  return { dueDateKey: addDaysToKey(today, REVIEW_INTERVALS_DAYS[0]), intervalIndex: 0 };
}

/**
 * Après une réussite en révision : palier suivant (J+3, puis J+7).
 * Renvoie null quand le dernier palier est franchi : l'exercice est maîtrisé, il ne revient plus.
 */
export function scheduleAfterSuccess(item: ReviewItem, today: Date): ReviewItem | null {
  const nextIndex = item.intervalIndex + 1;
  if (nextIndex >= REVIEW_INTERVALS_DAYS.length) return null;
  return { dueDateKey: addDaysToKey(today, REVIEW_INTERVALS_DAYS[nextIndex]), intervalIndex: nextIndex };
}

/** Les références des exercices à revoir aujourd'hui (ou en retard), les plus anciens d'abord. */
export function getDueRefs(items: ReviewItems, today: Date): string[] {
  const todayKey = toDateKey(today);
  return Object.entries(items)
    .filter(([, item]) => item.dueDateKey <= todayKey) // « AAAA-MM-JJ » se compare comme du texte
    .sort(([, a], [, b]) => a.dueDateKey.localeCompare(b.dueDateKey))
    .map(([ref]) => ref);
}

/** Construit la séance de révision du jour (au plus REVIEW_SESSION_SIZE exercices), ou undefined si rien. */
export function buildReviewSession(items: ReviewItems, today: Date): Lesson | undefined {
  const steps = getDueRefs(items, today)
    .map(getStepFromRef)
    .filter((step): step is LessonStep => step !== undefined) // on retire les exercices disparus du contenu
    .slice(0, REVIEW_SESSION_SIZE);

  if (steps.length === 0) return undefined;
  return { id: REVIEW_SESSION_ID, title: "Révision du jour", steps, newWords: [] };
}
