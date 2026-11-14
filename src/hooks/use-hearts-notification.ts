import { useEffect } from "react";
import { AppState } from "react-native";

import { getHeartsFullAt, computeHearts } from "@/lib/hearts";
import { cancelHeartsFullNotification, scheduleHeartsFullNotification } from "@/services/notifications";
import { useProgressStore } from "@/stores/progress-store";
import { useSettingsStore } from "@/stores/settings-store";

/**
 * Prévient l'utilisateur quand ses vies sont rechargées.
 * - Il QUITTE l'app sans aucune vie → on programme « Tes 5 vies sont rechargées ! » ;
 * - il REVIENT dans l'app → on annule (inutile : il est déjà là).
 * À utiliser UNE fois, à la racine de l'app.
 */
export function useHeartsNotification(): void {
  useEffect(() => {
    // AppState prévient quand l'app passe au premier plan (« active ») ou en arrière-plan (« background »)
    const subscription = AppState.addEventListener("change", (appState) => {
      const onError = (error: unknown) => console.warn("Notification des vies :", error);

      if (appState === "active") {
        cancelHeartsFullNotification().catch(onError);
        return;
      }
      if (appState !== "background") return;

      // getState() : lit le magasin à l'instant T (on est dans un événement, pas dans l'affichage)
      if (useSettingsStore.getState().isPremium) return;
      const { hearts, heartsRefillStartedAt } = useProgressStore.getState();
      const saved = { hearts, refillStartedAt: heartsRefillStartedAt };
      const now = Date.now();

      // Seulement s'il ne reste AUCUNE vie : pas de spam après chaque petite erreur
      if (computeHearts(saved, now).hearts > 0) return;
      const fullAt = getHeartsFullAt(saved, now);
      if (fullAt !== null) scheduleHeartsFullNotification(fullAt).catch(onError);
    });

    // Nettoyage : on arrête d'écouter si le composant disparaît
    return () => subscription.remove();
  }, []); // [] : on branche l'écoute une seule fois
}
