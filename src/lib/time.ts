/** Nombre de minutes dans une journée (24 × 60). */
export const MINUTES_PER_DAY = 1440;

/**
 * Transforme des minutes depuis minuit en texte « HH:MM ».
 * Exemple : 1140 → "19:00" ; 485 → "08:05"
 */
export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60); // 1140 / 60 = 19
  const mins = minutes % 60; //              reste de la division : 1140 % 60 = 0
  // padStart(2, "0") ajoute un zéro devant si besoin : "8" → "08"
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

/**
 * Ajoute (ou retire, si `delta` est négatif) des minutes à une heure,
 * en restant entre 00:00 et 23:59 : 23:45 + 15 min → 00:00.
 */
export function addMinutes(minutes: number, delta: number): number {
  return (minutes + delta + MINUTES_PER_DAY) % MINUTES_PER_DAY;
}

/** Petite légende qui accompagne l'heure du rappel. */
export function getTimeCaption(minutes: number): string {
  const hours = minutes / 60;
  if (hours < 11) return "Pour bien démarrer la journée";
  if (hours < 15) return "Une pause wolof à midi";
  if (hours < 17) return "Un petit break l'après-midi";
  if (hours < 20.5) return "L'heure du thé ataya";
  return "Avant de dormir, pour bien retenir";
}
