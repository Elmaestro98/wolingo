import { normalizeAnswer } from "@/lib/answer-checker";

/** Un mot, et s'il diffère de son équivalent dans l'autre phrase. */
export type DiffWord = {
  text: string;
  isDifferent: boolean;
};

/**
 * Compare la réponse de l'utilisateur et la bonne réponse, mot par mot, à la même position.
 *   « Joob lekk dem » vs « Joob angiy dem »
 *   → userWords :    Joob ✓  lekk ✗  dem ✓   (lekk sera barré)
 *   → correctWords : Joob ✓  angiy ✗ dem ✓   (angiy sera souligné)
 * Majuscules et ponctuation sont ignorées pour la comparaison (mais gardées pour l'affichage).
 */
export function compareAnswerWords(
  userAnswer: string,
  correctAnswer: string,
): { userWords: DiffWord[]; correctWords: DiffWord[] } {
  const userList = splitWords(userAnswer);
  const correctList = splitWords(correctAnswer);

  return {
    userWords: userList.map((word, index) => ({
      text: word,
      isDifferent: !sameWord(word, correctList[index]),
    })),
    correctWords: correctList.map((word, index) => ({
      text: word,
      isDifferent: !sameWord(word, userList[index]),
    })),
  };
}

/** Découpe une phrase en mots (les espaces multiples ne créent pas de mots vides). */
function splitWords(sentence: string): string[] {
  return sentence
    .trim()
    .split(/\s+/)
    .filter((word) => word !== "");
}

/** Deux mots sont « les mêmes » s'ils sont identiques une fois normalisés. Un mot absent n'est jamais pareil. */
function sameWord(a: string, b: string | undefined): boolean {
  return b !== undefined && normalizeAnswer(a) === normalizeAnswer(b);
}
