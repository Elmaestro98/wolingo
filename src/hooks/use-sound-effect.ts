import { useAudioPlayer, type AudioSource } from "expo-audio";
import { useCallback } from "react";

import { useSettingsStore } from "@/stores/settings-store";

/** Les petits sons de l'app (fabriqués à partir de notes de musique : libres de droits). */
export const SOUNDS = {
  correct: require("@/assets/sounds/correct.wav"),
  wrong: require("@/assets/sounds/wrong.wav"),
  complete: require("@/assets/sounds/complete.wav"),
} satisfies Record<string, AudioSource>;

/**
 * Prépare un son et renvoie une fonction pour le jouer.
 * Le son ne joue pas si l'utilisateur a coupé les sons dans son Profil.
 *
 * Exemple : `const playCorrect = useSoundEffect(SOUNDS.correct);` puis `playCorrect();`
 */
export function useSoundEffect(source: AudioSource): () => void {
  // useAudioPlayer : le lecteur est libéré tout seul quand l'écran disparaît
  const player = useAudioPlayer(source);
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);

  // useCallback : la MÊME fonction d'un affichage à l'autre (sinon un useEffect qui l'utilise rejouerait le son)
  return useCallback(() => {
    if (!soundEnabled) return;
    player.seekTo(0); // on rembobine au début : le son peut être rejoué plusieurs fois de suite
    player.play();
  }, [player, soundEnabled]);
}
