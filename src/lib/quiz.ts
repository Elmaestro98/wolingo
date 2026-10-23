import { LESSONS, type Lesson, type LessonStep } from "@/content/lessons";
import { MODULES, type Module } from "@/content/modules";
import { shuffle } from "@/lib/random";

/** Nombre de questions d'un Grand quiz de module. */
export const QUIZ_QUESTION_COUNT = 10;

/** Un exercice (à vérifier), par opposition aux explications et aux fiches. */
export function isExerciseStep(step: LessonStep): boolean {
  return step.type !== "explanation" && step.type !== "lesson_card";
}

/** Le module qui contient l'étape `itemId` (leçon, coffre ou quiz), ou undefined. */
export function findModuleOfItem(itemId: string): Module | undefined {
  return MODULES.find((moduleData) => moduleData.items.some((item) => item.id === itemId));
}

/**
 * Construit le Grand quiz d'un module, à partir de l'id de son étape « quiz » (ex. "u1-quiz") :
 * tous les exercices des leçons du module, mélangés, puis les QUIZ_QUESTION_COUNT premiers.
 * Renvoie undefined si l'id n'est pas celui d'un quiz.
 */
export function buildModuleQuiz(quizItemId: string): Lesson | undefined {
  const moduleData = findModuleOfItem(quizItemId);
  const quizItem = moduleData?.items.find((item) => item.id === quizItemId);
  if (!moduleData || quizItem?.kind !== "quiz") return undefined;

  const exercises = moduleData.items
    .filter((item) => item.kind === "lesson") //          les leçons du module
    .flatMap((item) => LESSONS[item.id]?.steps ?? []) //   toutes leurs étapes, en UNE seule liste
    .filter(isExerciseStep); //                            seulement les exercices

  return {
    id: quizItemId,
    title: quizItem.title,
    steps: shuffle(exercises).slice(0, QUIZ_QUESTION_COUNT), // 10 au hasard
    newWords: [], // un quiz révise : pas de nouveaux mots
  };
}
