/** L'humeur du lion après une réponse : content, très content (série), ou compatissant. */
export type MascotMood = "happy" | "combo" | "sad";

export type MascotReaction = {
  mood: MascotMood;
  /** Ce que dit le lion dans sa bulle ; null = pas de bulle */
  message: string | null;
};

/** À partir de combien de bonnes réponses d'affilée le lion fête la série. */
export const COMBO_THRESHOLD = 3;

/** Les encouragements après une erreur, utilisés à tour de rôle. */
export const ENCOURAGEMENTS = [
  "Pas grave, on le revoit à la fin !",
  "Tu y es presque !",
  "On apprend en se trompant !",
];

/**
 * Choisit la réaction du lion.
 * @param correctStreak bonnes réponses d'affilée, en comptant celle-ci
 * @param mistakeCount erreurs depuis le début de la leçon, en comptant celle-ci
 */
export function getMascotReaction(
  isCorrect: boolean,
  correctStreak: number,
  mistakeCount: number,
): MascotReaction {
  if (!isCorrect) {
    // % (modulo) : 1re erreur → 1er message, 2e → 2e, 3e → 3e, 4e → de nouveau le 1er…
    const index = Math.max(mistakeCount - 1, 0) % ENCOURAGEMENTS.length;
    return { mood: "sad", message: ENCOURAGEMENTS[index] };
  }
  if (correctStreak >= COMBO_THRESHOLD) {
    return { mood: "combo", message: `${correctStreak} d'affilée ! 🔥` };
  }
  return { mood: "happy", message: null };
}
