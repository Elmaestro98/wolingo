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
    example: "mangi fii…",
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
    // Plan du cahier des charges (section 4) ; contenu : unité 2 du cours de Xavier Bry
    id: "u2",
    number: 2,
    level: "A1",
    title: "Pronoms objets et relatifs",
    subtitle: "Dire « je le mange », « celui qui… » :",
    example: "maŋ koy lekk…",
    items: [
      { id: "u2-l1", kind: "lesson", title: "Pronoms objets", minutes: 5 },
      { id: "u2-l2", kind: "lesson", title: "Le progressif", minutes: 5 },
      { id: "u2-chest", kind: "chest", title: "Coffre", xpReward: 15 },
      { id: "u2-l3", kind: "lesson", title: "Le relatif « qui »", minutes: 5 },
      { id: "u2-l4", kind: "lesson", title: "Au marché", minutes: 5 },
      { id: "u2-quiz", kind: "quiz", title: "Grand quiz du module" },
    ],
  },
  {
    // Plan du cahier des charges (section 4) ; contenu : unité 3 du cours de Xavier Bry
    id: "u3",
    number: 3,
    level: "A1",
    title: "Possessif et accompli",
    subtitle: "Dire « mon livre », « il a mangé » :",
    example: "sumë tééré…",
    items: [
      { id: "u3-l1", kind: "lesson", title: "Le possessif", minutes: 5 },
      { id: "u3-l2", kind: "lesson", title: "« De » : -u", minutes: 5 },
      { id: "u3-chest", kind: "chest", title: "Coffre", xpReward: 15 },
      { id: "u3-l3", kind: "lesson", title: "L'accompli", minutes: 5 },
      { id: "u3-l4", kind: "lesson", title: "La négation", minutes: 5 },
      { id: "u3-l5", kind: "lesson", title: "La famille", minutes: 5 },
      { id: "u3-quiz", kind: "quiz", title: "Grand quiz du module" },
    ],
  },
  {
    // Plan du cahier des charges (section 4) ; contenu : unité 4 du cours de Xavier Bry
    id: "u4",
    number: 4,
    level: "A2",
    title: "Questions et nombres",
    subtitle: "Poser des questions, compter, payer :",
    example: "ban tééré ?…",
    items: [
      { id: "u4-l1", kind: "lesson", title: "Quel… ?", minutes: 5 },
      { id: "u4-l2", kind: "lesson", title: "« C'est… que »", minutes: 5 },
      { id: "u4-l3", kind: "lesson", title: "Où, comment, quand ?", minutes: 5 },
      { id: "u4-chest", kind: "chest", title: "Coffre", xpReward: 15 },
      { id: "u4-l4", kind: "lesson", title: "Qui ? Quoi ?", minutes: 5 },
      { id: "u4-l5", kind: "lesson", title: "Les nombres", minutes: 5 },
      { id: "u4-l6", kind: "lesson", title: "L'argent en dërëm", minutes: 5 },
      { id: "u4-quiz", kind: "quiz", title: "Grand quiz du module" },
    ],
  },
  {
    // Plan du cahier des charges (section 4) ; contenu : unité 5 du cours de Xavier Bry
    id: "u5",
    number: 5,
    level: "A2",
    title: "Subordonnées",
    subtitle: "Dire « je sais où ils vont » :",
    example: "xamnaa fu ñuy dem…",
    items: [
      { id: "u5-l1", kind: "lesson", title: "Le pronom dépendant", minutes: 5 },
      { id: "u5-l2", kind: "lesson", title: "Où, comment : fu, nu", minutes: 5 },
      { id: "u5-chest", kind: "chest", title: "Coffre", xpReward: 15 },
      { id: "u5-l3", kind: "lesson", title: "Qui, ce que : ku, li…", minutes: 5 },
      { id: "u5-l4", kind: "lesson", title: "« Le livre que… »", minutes: 5 },
      { id: "u5-quiz", kind: "quiz", title: "Grand quiz du module" },
    ],
  },
  {
    // Plan du cahier des charges (section 4) ; contenu : unité 6 du cours de Xavier Bry
    id: "u6",
    number: 6,
    level: "A2",
    title: "Indéfini, impératif, futur",
    subtitle: "Dire « prends ! », « je lirai » :",
    example: "jelal !…",
    items: [
      { id: "u6-l1", kind: "lesson", title: "« Un, une » : ab, aw…", minutes: 5 },
      { id: "u6-l2", kind: "lesson", title: "L'impératif", minutes: 5 },
      { id: "u6-chest", kind: "chest", title: "Coffre", xpReward: 15 },
      { id: "u6-l3", kind: "lesson", title: "« Ne… pas ! » : bul", minutes: 5 },
      { id: "u6-l4", kind: "lesson", title: "Le futur", minutes: 5 },
      { id: "u6-quiz", kind: "quiz", title: "Grand quiz du module" },
    ],
  },
];
