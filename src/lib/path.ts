import type { PathItem } from "@/content/modules";

/** État d'une étape du chemin. */
export type PathItemStatus = "completed" | "current" | "locked";

/** Une étape du chemin, enrichie de ce qu'il faut pour la dessiner. */
export type PathItemState = {
  item: PathItem;
  status: PathItemStatus;
  /** Étoiles obtenues (0 si pas terminée) */
  stars: number;
  /** Numéro de la leçon dans le module (1, 2, 3…), null pour un coffre ou un quiz */
  lessonNumber: number | null;
};

/**
 * Déduit l'état de chaque étape à partir de la progression.
 * Fonction "pure" : mêmes entrées → même résultat, sans rien modifier autour d'elle.
 *
 * Règle : terminée si présente dans `completedLessons` ;
 * la PREMIÈRE étape non terminée est « en cours » ; toutes les suivantes sont verrouillées.
 */
export function getPathItemStates(
  items: PathItem[],
  completedLessons: Record<string, number>,
): PathItemState[] {
  let currentFound = false; // a-t-on déjà trouvé l'étape « en cours » ?
  let lessonCounter = 0;

  return items.map((item) => {
    if (item.kind === "lesson") lessonCounter += 1;
    const lessonNumber = item.kind === "lesson" ? lessonCounter : null;

    const stars = completedLessons[item.id] ?? 0;
    if (stars > 0) {
      return { item, status: "completed", stars, lessonNumber };
    }
    if (!currentFound) {
      currentFound = true;
      return { item, status: "current", stars: 0, lessonNumber };
    }
    return { item, status: "locked", stars: 0, lessonNumber };
  });
}

/**
 * Décalage horizontal (en pixels) de chaque étape pour dessiner le zigzag.
 * Le motif se répète grâce au modulo (%) : étape 0 → 0, étape 1 → -72, … étape 6 → 0, etc.
 */
const ZIGZAG_PATTERN = [0, -72, 36, -54, 54, -40];

export function getZigzagOffset(index: number): number {
  return ZIGZAG_PATTERN[index % ZIGZAG_PATTERN.length];
}
