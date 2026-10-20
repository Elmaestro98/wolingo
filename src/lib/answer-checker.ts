/**
 * Correcteur tolérant des réponses tapées au clavier (cahier des charges : « correction tolérante »).
 * - exact : identique aux accents près (majuscules, ponctuation et espaces ignorés)
 * - near  : identique SI on oublie les accents (ë → e, é → e…) : accepté, mais signalé
 * - wrong : différent
 */
export type AnswerVerdict = "exact" | "near" | "wrong";

/** Minuscules, sans ponctuation, espaces simples. « Mangi  fi ! » → « mangi fi » */
export function normalizeAnswer(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,!?;:«»"'’()-]/g, " ") // la ponctuation devient un espace
    .replace(/\s+/g, " ") //              plusieurs espaces → un seul
    .trim(); //                           pas d'espace au début ni à la fin
}

/**
 * Retire les accents : « sumë tééré » → « sume teere ».
 * normalize("NFD") sépare chaque lettre de son accent (ë = e + ¨), puis on supprime les accents.
 * Les lettres propres au wolof (ñ, ŋ) restent distinctes de n : ce ne sont pas des « accents ».
 */
export function removeAccents(text: string): string {
  return text
    .replace(/ñ/g, "\u0000") // on met ñ de côté (sinon il deviendrait n)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // supprime les accents séparés
    .replace(/\u0000/g, "ñ"); //       on remet ñ
}

/** Compare la réponse tapée à toutes les réponses acceptées et rend le meilleur verdict. */
export function checkTypedAnswer(typed: string, acceptedAnswers: string[]): AnswerVerdict {
  const typedNormalized = normalizeAnswer(typed);
  if (typedNormalized === "") return "wrong";

  // 1er passage : une réponse exactement juste (aux accents près) ?
  if (acceptedAnswers.some((answer) => normalizeAnswer(answer) === typedNormalized)) {
    return "exact";
  }
  // 2e passage : juste si on ignore les accents ?
  const typedWithoutAccents = removeAccents(typedNormalized);
  if (acceptedAnswers.some((answer) => removeAccents(normalizeAnswer(answer)) === typedWithoutAccents)) {
    return "near";
  }
  return "wrong";
}
