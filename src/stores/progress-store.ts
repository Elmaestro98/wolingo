import Storage from "expo-sqlite/kv-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { getStreakAfterLesson, toDateKey } from "@/lib/dates";

/** Nombre de vies au début de chaque leçon. */
export const MAX_HEARTS = 5;

/**
 * PROVISOIRE : les leçons 1 et 2 du module 1 n'ont pas encore de contenu.
 * On les considère comme terminées pour pouvoir accéder à la leçon 3.
 */
const LESSONS_WITHOUT_CONTENT_YET: Record<string, number> = { "u1-l1": 3, "u1-l2": 2 };

type ProgressState = {
  /** Leçons terminées → meilleur nombre d'étoiles obtenu (1 à 3) */
  completedLessons: Record<string, number>;
  totalXp: number;
  /** Jours consécutifs avec au moins une leçon */
  streakDays: number;
  /** Jour de la dernière leçon terminée (« AAAA-MM-JJ »), null si jamais */
  lastActiveDateKey: string | null;
  /** Minutes d'apprentissage le jour `todayDateKey` */
  minutesToday: number;
  todayDateKey: string | null;

  completeLesson: (lessonId: string, result: { stars: number; xp: number; minutes: number }) => void;
  resetProgress: () => void;
};

const INITIAL_PROGRESS = {
  completedLessons: LESSONS_WITHOUT_CONTENT_YET,
  totalXp: 0,
  streakDays: 0,
  lastActiveDateKey: null,
  minutesToday: 0,
  todayDateKey: null,
};

/** Le magasin de la progression de l'apprenant, sauvegardé sur le téléphone. */
export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      ...INITIAL_PROGRESS,

      completeLesson: (lessonId, result) =>
        // Forme « fonction » de set : on part de l'état actuel pour calculer le nouveau
        set((state) => {
          const today = new Date();
          const todayKey = toDateKey(today);
          const previousStars = state.completedLessons[lessonId] ?? 0;

          return {
            // On garde le MEILLEUR score : refaire une leçon moins bien ne fait pas perdre d'étoiles
            completedLessons: { ...state.completedLessons, [lessonId]: Math.max(previousStars, result.stars) },
            totalXp: state.totalXp + result.xp,
            streakDays: getStreakAfterLesson(state.streakDays, state.lastActiveDateKey, today),
            lastActiveDateKey: todayKey,
            // Nouveau jour → le compteur de minutes repart de zéro
            minutesToday: (state.todayDateKey === todayKey ? state.minutesToday : 0) + result.minutes,
            todayDateKey: todayKey,
          };
        }),

      resetProgress: () => set(INITIAL_PROGRESS),
    }),
    {
      name: "wolingo-progress",
      storage: createJSONStorage(() => ({
        getItem: (key) => Storage.getItemSync(key),
        setItem: (key, value) => Storage.setItemSync(key, value),
        removeItem: (key) => Storage.removeItemSync(key),
      })),
    },
  ),
);
