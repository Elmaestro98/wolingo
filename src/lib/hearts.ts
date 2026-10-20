/** Nombre maximum de vies (version gratuite). */
export const MAX_HEARTS = 5;
/** Une vie revient toutes les 30 minutes (en millisecondes). */
export const HEART_REFILL_MS = 30 * 60 * 1000;

/**
 * Ce qu'on sauvegarde : le nombre de vies à un instant donné, et l'heure où la recharge a commencé.
 * refillStartedAt = null quand les vies sont pleines (rien à recharger).
 */
export type HeartsState = {
  hearts: number;
  refillStartedAt: number | null;
};

/**
 * Calcule les vies À L'INSTANT `now` : les vies sauvegardées + celles regagnées depuis.
 * Exemple : 2 vies, recharge commencée il y a 70 min → 2 + 2 = 4 vies, prochaine dans 20 min.
 */
export function computeHearts(saved: HeartsState, now: number): HeartsState {
  if (saved.hearts >= MAX_HEARTS || saved.refillStartedAt === null) {
    return { hearts: Math.min(saved.hearts, MAX_HEARTS), refillStartedAt: null };
  }
  const regained = Math.floor((now - saved.refillStartedAt) / HEART_REFILL_MS);
  const hearts = Math.min(saved.hearts + regained, MAX_HEARTS);
  if (hearts >= MAX_HEARTS) {
    return { hearts: MAX_HEARTS, refillStartedAt: null }; // tout est rechargé
  }
  // On avance le point de départ des vies déjà regagnées : la prochaine arrive 30 min plus tard
  return { hearts, refillStartedAt: saved.refillStartedAt + regained * HEART_REFILL_MS };
}

/** Retire une vie (jamais sous 0). Si les vies étaient pleines, la recharge commence maintenant. */
export function loseOneHeart(saved: HeartsState, now: number): HeartsState {
  const current = computeHearts(saved, now);
  return {
    hearts: Math.max(current.hearts - 1, 0),
    refillStartedAt: current.refillStartedAt ?? now,
  };
}

/** Temps restant avant la prochaine vie, en millisecondes (null si les vies sont pleines). */
export function getTimeUntilNextHeart(saved: HeartsState, now: number): number | null {
  const current = computeHearts(saved, now);
  if (current.refillStartedAt === null) return null;
  return current.refillStartedAt + HEART_REFILL_MS - now;
}

/** Affiche une durée en « MM:SS ». 1 453 000 ms → « 24:13 » */
export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
