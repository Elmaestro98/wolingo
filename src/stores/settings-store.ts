import Storage from "expo-sqlite/kv-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/** Durées d'objectif possibles (écran 02). */
export type DailyGoalMinutes = 5 | 10 | 15;
/** Niveaux de départ possibles (écran 04). */
export type StartLevel = "beginner" | "basics";

type SettingsState = {
  // ---- Les DONNÉES mémorisées ----
  /** L'utilisateur a-t-il terminé l'onboarding (écrans 01 à 04) ? */
  hasCompletedOnboarding: boolean;
  dailyGoalMinutes: DailyGoalMinutes;
  reminderEnabled: boolean;
  /** Heure du rappel, en minutes depuis minuit (1140 = 19:00) */
  reminderTime: number;
  /** null tant que l'utilisateur n'a pas choisi */
  startLevel: StartLevel | null;
  /**
   * Version Premium : vies illimitées.
   * Pour l'instant activée par un interrupteur de test (le paiement est hors V1).
   */
  isPremium: boolean;

  // ---- Les ACTIONS : les seules façons de modifier les données ----
  setDailyGoal: (minutes: DailyGoalMinutes) => void;
  setReminder: (enabled: boolean, time: number) => void;
  completeOnboarding: (level: StartLevel) => void;
  resetOnboarding: () => void;
  setPremium: (isPremium: boolean) => void;
};

/**
 * Le magasin des réglages de l'app, partagé par tous les écrans.
 * `persist` le sauvegarde sur le téléphone : il survit à la fermeture de l'app.
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Valeurs de départ (au tout premier lancement)
      hasCompletedOnboarding: false,
      dailyGoalMinutes: 10,
      reminderEnabled: true,
      reminderTime: 1140,
      startLevel: null,
      isPremium: false,

      // `set` modifie le magasin, puis prévient tous les écrans qui l'utilisent
      setDailyGoal: (minutes) => set({ dailyGoalMinutes: minutes }),
      setReminder: (enabled, time) => set({ reminderEnabled: enabled, reminderTime: time }),
      completeOnboarding: (level) => set({ startLevel: level, hasCompletedOnboarding: true }),
      resetOnboarding: () => set({ hasCompletedOnboarding: false }),
      setPremium: (isPremium) => set({ isPremium }),
    }),
    {
      // Nom de la sauvegarde sur le téléphone
      name: "wolingo-settings",
      // Où sauvegarder : le stockage clé-valeur d'expo-sqlite.
      // Version « Sync » (synchrone) : les réglages sont lus AVANT le premier affichage,
      // donc pas de clignotement de l'onboarding au démarrage.
      storage: createJSONStorage(() => ({
        getItem: (key) => Storage.getItemSync(key),
        setItem: (key, value) => Storage.setItemSync(key, value),
        removeItem: (key) => Storage.removeItemSync(key),
      })),
    },
  ),
);
