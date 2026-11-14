import { setAudioModeAsync } from "expo-audio";

/**
 * Le « mode audio » est un réglage GLOBAL du téléphone (un seul pour toute l'app).
 * - Voix wolof → jouent même si l'iPhone est en mode silencieux
 * - Petits sons (« ding ») → respectent le mode silencieux
 * On bascule juste avant de jouer, et seulement si c'est nécessaire (le réglage prend un instant).
 */
let current: boolean | null = null;

export async function setPlaysInSilentMode(playsInSilentMode: boolean): Promise<void> {
  if (current === playsInSilentMode) return; // déjà bon : rien à faire
  current = playsInSilentMode;
  try {
    // mixWithOthers : nos sons se mélangent à la musique de l'utilisateur au lieu de la couper
    await setAudioModeAsync({ playsInSilentMode, interruptionMode: "mixWithOthers" });
  } catch {
    current = null; // échec (rare) : on réessaiera la prochaine fois
  }
}
