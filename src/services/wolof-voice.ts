import { createAudioPlayer, type AudioPlayer } from "expo-audio";

import { WOLOF_AUDIO } from "@/content/audio-manifest";
import { audioKey } from "@/lib/audio-key";
import { setPlaysInSilentMode } from "@/services/audio-mode";

/** Vitesse de la lecture lente (1 = normal). */
const SLOW_RATE = 0.6;

// UN SEUL lecteur pour toute l'app : une nouvelle voix coupe la précédente, jamais deux en même temps.
// Créé au premier besoin, gardé ensuite (il n'est pas lié à un écran).
let player: AudioPlayer | null = null;
let loadedKey: string | null = null;

/** Est-ce qu'un enregistrement existe pour ce texte ? (sinon on cache le bouton 🔊) */
export function hasWolofAudio(text: string): boolean {
  return audioKey(text) in WOLOF_AUDIO;
}

/** Joue la voix d'un texte wolof. Ne fait rien si l'enregistrement n'existe pas encore. */
export async function playWolof(text: string, options: { slow?: boolean } = {}): Promise<void> {
  const key = audioKey(text);
  const source = WOLOF_AUDIO[key];
  if (!source) return;

  try {
    await setPlaysInSilentMode(true); // décision validée : les voix jouent même en mode silencieux

    if (!player) {
      player = createAudioPlayer(source);
    } else if (loadedKey !== key) {
      player.replace(source); // on change de fichier sans recréer le lecteur
    }
    loadedKey = key;

    // « high » : la voix ralentie garde sa hauteur normale (pas de voix grave)
    player.setPlaybackRate(options.slow ? SLOW_RATE : 1, "high");
    await player.seekTo(0); // on rembobine : la même voix peut être rejouée
    player.play();
  } catch (error) {
    // Un son qui rate ne doit jamais faire planter la leçon
    console.warn("Voix wolof impossible à jouer :", text, error);
  }
}
