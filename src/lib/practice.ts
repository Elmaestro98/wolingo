import { LESSONS } from "@/content/lessons";
import { buildReviewSession, REVIEW_SESSION_ID, type ReviewItems } from "@/lib/review";

/**
 * Une séance de « pratique » : refaire une leçon déjà terminée, ou la révision du jour.
 * Pendant la pratique, on ne perd pas de vie, et la finir en rend une.
 */
export function isPracticeSession(lessonId: string, completedLessons: Record<string, number>): boolean {
  return lessonId === REVIEW_SESSION_ID || lessonId in completedLessons;
}

/**
 * La meilleure séance pour regagner une vie :
 * 1. la révision du jour s'il y a des exercices à revoir (c'est la plus utile pour apprendre) ;
 * 2. sinon la dernière leçon terminée ;
 * 3. sinon rien (undefined) : l'utilisateur n'a encore rien terminé.
 */
export function getPracticeLessonId(
  completedLessons: Record<string, number>,
  reviewItems: ReviewItems,
  today: Date,
): string | undefined {
  if (buildReviewSession(reviewItems, today)) return REVIEW_SESSION_ID;
  // Object.keys garde l'ordre d'ajout : la dernière clé = la dernière leçon terminée.
  // On ne garde que les vraies leçons (pas les Grands quiz, tirés au hasard).
  const finishedLessons = Object.keys(completedLessons).filter((id) => id in LESSONS);
  return finishedLessons.at(-1);
}
