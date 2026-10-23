/**
 * Le contenu de la notification de rappel quotidien (le même que l'aperçu de la maquette 03).
 * Fonction pure : facile à tester, sans toucher au téléphone.
 */
export function buildReminderContent(lessonMinutes: number): { title: string; body: string } {
  return {
    title: "Nanga def ! C'est l'heure du wolof",
    body: `Ta leçon de ${lessonMinutes} min t'attend.`,
  };
}

/** Découpe une heure en minutes depuis minuit en heure + minute : 1140 → { hour: 19, minute: 0 }. */
export function toHourMinute(minutesOfDay: number): { hour: number; minute: number } {
  return { hour: Math.floor(minutesOfDay / 60), minute: minutesOfDay % 60 };
}
