/** 1 dërëm vaut 5 francs CFA (cahier des charges : « argent en dërëm »). */
export const CFA_PER_DEREM = 5;

/** Convertit un montant en dërëm vers des francs CFA. 100 dërëm → 500 F */
export function deremToCfa(derem: number): number {
  return derem * CFA_PER_DEREM;
}

/**
 * Écrit un nombre à la française, avec un espace tous les 3 chiffres : 5000 → « 5 000 ».
 * (On l'écrit nous-mêmes : toLocaleString n'est pas fiable sur tous les téléphones.)
 */
export function formatNumber(value: number): string {
  // L'expression régulière repère les endroits suivis d'un multiple de 3 chiffres jusqu'à la fin
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/**
 * Position de la bonne réponse : celle dont le montant en dërëm vaut exactement le prix en F CFA.
 * Renvoie -1 si aucune ne correspond (erreur dans le contenu).
 */
export function findDeremAnswerIndex(priceCfa: number, choicesInDerem: number[]): number {
  return choicesInDerem.findIndex((derem) => deremToCfa(derem) === priceCfa);
}
