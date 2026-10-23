import Storage from "expo-sqlite/kv-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { getStreakAfterLesson, toDateKey } from "@/lib/dates";
import { loseOneHeart, MAX_HEARTS } from "@/lib/hearts";
import { scheduleAfterMistake, scheduleAfterSuccess, type ReviewItems } from "@/lib/review";

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
  /** Vies au moment de la dernière perte (version gratuite). Les vies ACTUELLES se calculent avec computeHearts. */
  hearts: number;
  /** Heure (ms) du début de la recharge ; null si les vies sont pleines */
  heartsRefillStartedAt: number | null;
  /** Exercices ratés à revoir (révision espacée J+1, J+3, J+7), rangés par référence « leçon#position » */
  reviewItems: ReviewItems;

  completeLesson: (lessonId: string, result: { stars: number; xp: number; minutes: number }) => void;
  /** Retire une vie (à n'appeler que pour un utilisateur gratuit) */
  loseHeart: () => void;
  /** Exercice raté : il reviendra demain en révision */
  scheduleReview: (stepRef: string) => void;
  /** Exercice réussi en révision : palier suivant, ou retiré s'il est maîtrisé */
  markReviewSuccess: (stepRef: string) => void;
  resetProgress: () => void;
};

const INITIAL_PROGRESS = {
  completedLessons: {},
  totalXp: 0,
  streakDays: 0,
  lastActiveDateKey: null,
  minutesToday: 0,
  todayDateKey: null,
  hearts: MAX_HEARTS,
  heartsRefillStartedAt: null,
  reviewItems: {},
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
            completedLessons: {
              ...state.completedLessons,
              [lessonId]: Math.max(previousStars, result.stars),
            },
            totalXp: state.totalXp + result.xp,
            streakDays: getStreakAfterLesson(state.streakDays, state.lastActiveDateKey, today),
            lastActiveDateKey: todayKey,
            // Nouveau jour → le compteur de minutes repart de zéro
            minutesToday: (state.todayDateKey === todayKey ? state.minutesToday : 0) + result.minutes,
            todayDateKey: todayKey,
          };
        }),

      loseHeart: () =>
        set((state) => {
          const next = loseOneHeart(
            { hearts: state.hearts, refillStartedAt: state.heartsRefillStartedAt },
            Date.now(),
          );
          return { hearts: next.hearts, heartsRefillStartedAt: next.refillStartedAt };
        }),

      scheduleReview: (stepRef) =>
        set((state) => ({
          // { ...ancien, [clé]: nouveau } : ajoute ou remplace UNE entrée, sans toucher aux autres
          reviewItems: { ...state.reviewItems, [stepRef]: scheduleAfterMistake(new Date()) },
        })),

      markReviewSuccess: (stepRef) =>
        set((state) => {
          const item = state.reviewItems[stepRef];
          if (!item) return {}; // rien à faire : l'exercice n'était pas en révision
          const next = scheduleAfterSuccess(item, new Date());
          // Maîtrisé (next = null) → on retire l'entrée : on garde toutes les AUTRES
          const others = Object.fromEntries(
            Object.entries(state.reviewItems).filter(([ref]) => ref !== stepRef),
          );
          return { reviewItems: next ? { ...others, [stepRef]: next } : others };
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
