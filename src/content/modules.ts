/**
 * Contenu pédagogique : les modules et leurs étapes.
 * Ce fichier ne contient QUE des données (aucun affichage).
 * Plus tard, il sera remplacé par des fichiers JSON (content/modules/module-01.json…).
 */

/** Les 3 sortes d'étapes du chemin. */
export type PathItemKind = "lesson" | "chest" | "quiz";

export type PathItem = {
  id: string;
  kind: PathItemKind;
  title: string;
  /** Durée estimée (leçons uniquement) */
  minutes?: number;
  /** XP offerts (coffres uniquement) */
  xpReward?: number;
};

export type Module = {
  id: string;
  number: number;
  /** Niveau européen (A1, A2…) */
  level: string;
  title: string;
  /** Phrase d'accroche… */
  subtitle: string;
  /** …suivie d'un exemple wolof mis en valeur */
  example: string;
  items: PathItem[];
};

export const MODULES: Module[] = [
  {
    id: "u1",
    number: 1,
    level: "A1",
    title: "Le présent",
    subtitle: "Dire où tu es et ce que tu fais :",
    example: "mangi fi…",
    items: [
      { id: "u1-l1", kind: "lesson", title: "Salutations", minutes: 5 },
      { id: "u1-l2", kind: "lesson", title: "Pronoms", minutes: 5 },
      { id: "u1-l3", kind: "lesson", title: "Présent d'action", minutes: 5 },
      { id: "u1-chest", kind: "chest", title: "Coffre", xpReward: 15 },
      { id: "u1-l4", kind: "lesson", title: "Voici & voilà", minutes: 5 },
      { id: "u1-l5", kind: "lesson", title: "Le pluriel", minutes: 5 },
      { id: "u1-quiz", kind: "quiz", title: "Grand quiz du module" },
    ],
  },
  {
    id: "u2",
    number: 2,
    level: "A1",
    title: "La famille & la maison",
    subtitle: "Parler de tes proches et de ton foyer :",
    example: "sama kër…",
    items: [],
  },
];
