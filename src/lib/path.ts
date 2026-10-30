import type { Module, PathItem } from "@/content/modules";

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
 * Règles :
 * - terminée si présente dans `completedLessons` ;
 * - la PREMIÈRE étape non terminée est « en cours » ; toutes les suivantes sont verrouillées ;
 * - le quiz du module ne s'ouvre QUE si toutes les leçons du module sont terminées.
 */
export function getPathItemStates(
  items: PathItem[],
  completedLessons: Record<string, number>,
): PathItemState[] {
  let currentFound = false; // a-t-on déjà trouvé l'étape « en cours » ?
  let lessonCounter = 0;
  const canTakeQuiz = areAllLessonsCompleted(items, completedLessons);

  return items.map((item) => {
    if (item.kind === "lesson") lessonCounter += 1;
    const lessonNumber = item.kind === "lesson" ? lessonCounter : null;

    const stars = completedLessons[item.id] ?? 0;
    if (stars > 0) {
      return { item, status: "completed", stars, lessonNumber };
    }
    // Un coffre ne bloque jamais le chemin : il s'ouvre tout seul dès que tout ce qui précède est terminé.
    // (Plus tard : créditer ses XP en bonus.)
    if (item.kind === "chest" && !currentFound) {
      return { item, status: "completed", stars: 0, lessonNumber };
    }
    // Le quiz reste verrouillé tant qu'une seule leçon du module n'est pas bouclée, quelle que soit sa place
    if (item.kind === "quiz" && !canTakeQuiz) {
      return { item, status: "locked", stars: 0, lessonNumber };
    }
    if (!currentFound) {
      currentFound = true;
      return { item, status: "current", stars: 0, lessonNumber };
    }
    return { item, status: "locked", stars: 0, lessonNumber };
  });
}

/** Un module est validé quand son Grand quiz est réussi. */
export function isModuleCompleted(moduleData: Module, completedLessons: Record<string, number>): boolean {
  const quiz = moduleData.items.find((item) => item.kind === "quiz");
  return quiz !== undefined && (completedLessons[quiz.id] ?? 0) > 0;
}

/**
 * Le module à afficher sur le Parcours : le premier module NON validé qui a du contenu.
 * Les modules encore vides (pas d'étapes) sont ignorés : on reste sur le dernier module jouable.
 */
export function getCurrentModule(modules: Module[], completedLessons: Record<string, number>): Module {
  const playableModules = modules.filter((moduleData) => moduleData.items.length > 0);
  return (
    playableModules.find((moduleData) => !isModuleCompleted(moduleData, completedLessons)) ??
    playableModules[playableModules.length - 1] // tout est validé → on reste sur le dernier
  );
}

/** État d'un module dans le sélecteur du Parcours. */
export type ModuleStatus = "completed" | "current" | "locked";

/**
 * L'état de chaque module, pour le sélecteur :
 * - validé (Grand quiz réussi) → on peut le revoir ;
 * - en cours (celui de getCurrentModule) → celui qu'on est en train de faire ;
 * - verrouillé → tous les autres, y compris les modules encore sans contenu.
 */
export function getModuleStatuses(
  modules: Module[],
  completedLessons: Record<string, number>,
): { module: Module; status: ModuleStatus }[] {
  const currentModule = getCurrentModule(modules, completedLessons);
  return modules.map((moduleData) => {
    let status: ModuleStatus = "locked";
    if (isModuleCompleted(moduleData, completedLessons)) status = "completed";
    else if (moduleData.id === currentModule.id) status = "current";
    return { module: moduleData, status };
  });
}

/** Toutes les leçons du module sont-elles terminées ? (condition pour passer le quiz) */
export function areAllLessonsCompleted(items: PathItem[], completedLessons: Record<string, number>): boolean {
  // every : vrai seulement si CHAQUE leçon a au moins une étoile
  return items
    .filter((item) => item.kind === "lesson")
    .every((lesson) => (completedLessons[lesson.id] ?? 0) > 0);
}

/**
 * Décalage horizontal (en pixels) de chaque étape pour dessiner le zigzag.
 * Le motif se répète grâce au modulo (%) : étape 0 → 0, étape 1 → -72, … étape 6 → 0, etc.
 */
const ZIGZAG_PATTERN = [0, -72, 36, -54, 54, -40];

export function getZigzagOffset(index: number): number {
  return ZIGZAG_PATTERN[index % ZIGZAG_PATTERN.length];
}
