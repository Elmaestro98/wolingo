import { useEffect } from "react";

import { syncDailyReminder } from "@/services/notifications";
import { useSettingsStore } from "@/stores/settings-store";

/**
 * Garde le rappel du téléphone synchronisé avec les réglages de l'app.
 * À utiliser UNE fois, à la racine de l'app.
 *
 * C'est le rôle typique de useEffect : synchroniser l'app avec un système EXTÉRIEUR
 * (ici, les notifications de l'iPhone) chaque fois que certaines valeurs changent.
 */
export function useReminderSync(): void {
  const hasCompletedOnboarding = useSettingsStore((state) => state.hasCompletedOnboarding);
  const reminderEnabled = useSettingsStore((state) => state.reminderEnabled);
  const reminderTime = useSettingsStore((state) => state.reminderTime);
  const dailyGoalMinutes = useSettingsStore((state) => state.dailyGoalMinutes);

  useEffect(() => {
    // Pas avant la fin de l'onboarding : on ne demande pas la permission dès le tout premier écran.
    // La demande arrive juste après « Activer le rappel à 19:00 » + le choix du niveau : au bon moment.
    if (!hasCompletedOnboarding) return;

    syncDailyReminder({
      enabled: reminderEnabled,
      timeMinutes: reminderTime,
      lessonMinutes: dailyGoalMinutes,
    }).catch((error) => {
      // Un souci de notification ne doit jamais faire planter l'app : on le note seulement
      console.warn("Rappel quotidien non programmé :", error);
    });
  }, [hasCompletedOnboarding, reminderEnabled, reminderTime, dailyGoalMinutes]); // ← relancé si l'une change
}
