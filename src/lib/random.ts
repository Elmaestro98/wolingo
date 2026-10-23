/**
 * Mélange une liste au hasard (algorithme de Fisher-Yates). Renvoie une NOUVELLE liste :
 * la liste de départ n'est jamais modifiée.
 */
export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]; // échange les deux éléments
  }
  return result;
}
