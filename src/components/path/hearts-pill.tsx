import { StatPill } from "@/components/path/stat-pill";
import { useNow } from "@/hooks/use-now";
import { computeHearts, formatCountdown, getTimeUntilNextHeart } from "@/lib/hearts";
import { useProgressStore } from "@/stores/progress-store";
import { useSettingsStore } from "@/stores/settings-store";

/**
 * Pastille des vies de l'en-tête du Parcours, avec le compte à rebours avant la prochaine vie.
 * C'est un composant à part pour que SEULE cette pastille se redessine chaque seconde,
 * et pas tout l'écran d'accueil.
 */
export function HeartsPill() {
  const isPremium = useSettingsStore((state) => state.isPremium);
  const savedHearts = useProgressStore((state) => state.hearts);
  const refillStartedAt = useProgressStore((state) => state.heartsRefillStartedAt);

  // L'heure actuelle, mise à jour chaque seconde → le compte à rebours avance tout seul
  const now = useNow(1000);

  if (isPremium) {
    return <StatPill icon="heart" iconColor="#E5484D" value="∞" accessibilityLabel="Vies illimitées" />;
  }

  const saved = { hearts: savedHearts, refillStartedAt };
  const currentHearts = computeHearts(saved, now).hearts;
  // null quand les vies sont pleines → pas de compte à rebours
  const timeLeft = getTimeUntilNextHeart(saved, now);
  const countdown = timeLeft === null ? undefined : formatCountdown(timeLeft);

  return (
    <StatPill
      icon="heart"
      iconColor="#E5484D"
      value={currentHearts}
      detail={countdown}
      accessibilityLabel={
        countdown ? `${currentHearts} vies, prochaine vie dans ${countdown}` : `${currentHearts} vies`
      }
    />
  );
}
