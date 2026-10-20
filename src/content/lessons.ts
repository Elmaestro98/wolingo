/**
 * Contenu des leçons : la suite d'étapes de chaque leçon.
 * ⚠️ Tout texte wolof doit être relu par un locuteur natif avant publication.
 */
import type { ContentImageName } from "@/content/images";

/** Un exemple wolof avec sa traduction. */
export type Example = {
  wolof: string;
  french: string;
};

/** Étape « explication » : une règle + des exemples. */
export type ExplanationStepData = {
  type: "explanation";
  /** Petit surtitre doré (ex. « Point grammaire ») */
  eyebrow: string;
  title: string;
  text: string;
  examples: Example[];
};

/** Exercice QCM : une phrase wolof, 4 traductions possibles, une seule bonne. */
export type MultipleChoiceStepData = {
  type: "multiple_choice";
  eyebrow: string;
  /** La consigne (ex. « Que veut dire cette phrase ? ») */
  question: string;
  /** La phrase wolof à traduire */
  prompt: string;
  /** Prononciation « à la française » (ex. « man-gui fi ») */
  pronunciation?: string;
  /** Petite phrase de contexte sous la phrase wolof */
  context?: string;
  /** Nom d'une image du catalogue (content/images.ts) */
  image?: ContentImageName;
  choices: string[];
  /** Position de la bonne réponse dans `choices` (0 = la première) */
  answerIndex: number;
  /** Explication affichée dans le panneau de correction */
  explanation: string;
};

/** Exercice « compléter la phrase » : choisir le mot qui manque dans une phrase wolof. */
export type FillBlankStepData = {
  type: "fill_blank";
  eyebrow: string;
  /** La consigne (ex. « Complète la phrase ») */
  question: string;
  /** Le personnage qui « dit » la phrase */
  speaker: { name: string; subtitle: string; image: ContentImageName };
  /** Ce qui vient avant le trou… */
  before: string;
  /** …et ce qui vient après */
  after: string;
  /** Traduction française de la phrase complète */
  translation: string;
  /** Petit titre au-dessus des choix (ex. « Choisis la particule ») */
  choicesLabel: string;
  choices: string[];
  answerIndex: number;
  /** Indice facultatif, affiché si l'utilisateur le demande */
  hint?: string;
  explanation: string;
};

/** Une paire à associer : un nom wolof (+ sa traduction) et son article. */
export type MatchPair = {
  wolof: string;
  french: string;
  /** ⚠️ Les articles d'un même exercice doivent être tous différents */
  article: string;
};

/** Exercice « associer » : relier chaque nom à son article. Vérifié paire par paire. */
export type MatchPairsStepData = {
  type: "match_pairs";
  eyebrow: string;
  question: string;
  instruction: string;
  pairs: MatchPair[];
  explanation: string;
};

/** Exercice « construire la phrase » : remettre des tuiles de mots dans le bon ordre. */
export type BuildSentenceStepData = {
  type: "build_sentence";
  eyebrow: string;
  question: string;
  /** La phrase française à traduire */
  sourceText: string;
  /** La bonne phrase, mot par mot, dans l'ordre */
  answer: string[];
  /** Toutes les tuiles proposées : les mots de la réponse + des intrus, déjà dans l'ordre d'affichage */
  tiles: string[];
  explanation: string;
};

/** Exercice « écrire en wolof » : taper la traduction au clavier. Correction tolérante. */
export type WriteTranslationStepData = {
  type: "write_translation";
  eyebrow: string;
  question: string;
  /** Le personnage qui dit la phrase française */
  speaker: { name: string; image: ContentImageName };
  /** La phrase française à traduire */
  sourceText: string;
  /**
   * Toutes les réponses acceptées (variantes d'orthographe, de dialecte…).
   * La PREMIÈRE est celle affichée comme « bonne réponse ».
   */
  acceptedAnswers: string[];
  hint?: string;
  explanation: string;
};

/**
 * Une étape de leçon : une « union discriminée ». Le `|` veut dire « ou » :
 * une étape est SOIT une explication, SOIT un QCM, SOIT une phrase à compléter, SOIT des paires,
 * SOIT une phrase à construire, SOIT une phrase à écrire. Le champ `type` dit laquelle.
 */
export type LessonStep =
  | ExplanationStepData
  | MultipleChoiceStepData
  | FillBlankStepData
  | MatchPairsStepData
  | BuildSentenceStepData
  | WriteTranslationStepData;

export type Lesson = {
  id: string;
  title: string;
  steps: LessonStep[];
  /** Mots nouveaux de la leçon, affichés sur l'écran « Leçon terminée » */
  newWords: Example[];
};

/** Toutes les leçons, rangées par id pour les retrouver directement : LESSONS["u1-l3"]. */
export const LESSONS: Record<string, Lesson> = {
  "u1-l3": {
    id: "u1-l3",
    title: "Présent d'action",
    newWords: [
      { wolof: "dem", french: "partir" },
      { wolof: "lekk", french: "manger" },
      { wolof: "xar", french: "mouton" },
      { wolof: "tééré", french: "livre" },
    ],
    steps: [
      {
        type: "explanation",
        eyebrow: "Point grammaire",
        title: "Ce qu'on fait en ce moment",
        text: "Pour dire qu'une action est en train de se faire, le présent démonstratif prend la forme progressive : mangi devient mangiy.",
        examples: [{ wolof: "Mangi fi", french: "Je suis ici" }],
      },
      {
        type: "multiple_choice",
        eyebrow: "Nouveau mot",
        question: "Que veut dire cette phrase ?",
        prompt: "Mangi fi",
        pronunciation: "man-gui fi",
        context: "Réponse courante à « Nanga def ? »",
        image: "man",
        choices: ["Je suis ici", "Il est là-bas", "Tu es assis", "Nous partons"],
        answerIndex: 0,
        explanation: "Fi = ici même. Pour un endroit éloigné, on dit fale : Mangë fale.",
      },
      {
        type: "explanation",
        eyebrow: "Avec un nom",
        title: "Nom + angiy + verbe",
        text: "Avec un nom, a + ngi + di se contracte en « angiy », placé juste avant le verbe.",
        examples: [{ wolof: "Joob angiy dem", french: "Diop est en train de s'en aller" }],
      },
      {
        type: "build_sentence",
        eyebrow: "Présent continu",
        question: "Construis la phrase en wolof",
        sourceText: "Diop est en train de s'en aller.",
        answer: ["Joob", "angiy", "dem"],
        tiles: ["mungi", "lekk", "Joob", "Faatu", "dem", "angiy"],
        explanation: "a + ngi + di se contracte en angiy : sujet + angiy + verbe = une action en cours.",
      },
      {
        type: "multiple_choice",
        eyebrow: "Présent continu",
        question: "Que veut dire cette phrase ?",
        prompt: "Joob angiy dem",
        choices: ["Diop est ici", "Diop est en train de s'en aller", "Diop mange la feuille", "Je prends mon livre"],
        answerIndex: 1,
        explanation: "angiy + verbe = une action en cours : Diop est en train de partir.",
      },
      {
        type: "explanation",
        eyebrow: "Au quotidien",
        title: "Une phrase complète",
        text: "Le sujet, la forme progressive, le verbe, puis le complément avec son article.",
        examples: [
          { wolof: "Xar bangiy lekk xob wi", french: "Le mouton mange la feuille" },
          { wolof: "Mangi jel sumë tééré", french: "Je prends mon livre" },
        ],
      },
      {
        type: "write_translation",
        eyebrow: "Traduction écrite",
        question: "Écris cette phrase en wolof",
        speaker: { name: "Awa", image: "awa" },
        sourceText: "Je prends mon livre.",
        // Orthographe du cours en premier ; orthographe de la maquette acceptée aussi (question ouverte du cahier)
        acceptedAnswers: ["Mangi jel sumë tééré", "Mangi jël sumë téere"],
        hint: "jel = prendre · sumë = mon · tééré = livre",
        explanation: "Mangi + verbe : je suis en train de… Ici, mangi jel = je prends.",
      },
      {
        type: "fill_blank",
        eyebrow: "Présent d'action",
        question: "Complète la phrase",
        speaker: { name: "Baye le mouton", subtitle: "raconte sa journée", image: "sheep" },
        before: "Xar bi",
        after: "lekk xob wi",
        translation: "Le mouton mange la feuille",
        choicesLabel: "Choisis la particule",
        choices: ["angiy", "bangiy", "mungiy", "laa"],
        answerIndex: 2,
        hint: "Le sujet, xar bi, est à la 3ᵉ personne du singulier (il / elle).",
        explanation: "mungiy + verbe = il / elle est en train de… : Xar bi mungiy lekk xob wi.",
      },
      {
        // Provisoire dans cette leçon pour tester l'exercice ; ira dans la leçon sur les classes nominales
        type: "match_pairs",
        eyebrow: "Classes nominales",
        question: "Associe chaque nom à son article",
        instruction: "Touche un nom, puis l'article qui va avec.",
        pairs: [
          { wolof: "kër", french: "la maison", article: "gi" },
          { wolof: "nit", french: "la personne", article: "ki" },
          { wolof: "fas", french: "le cheval", article: "wi" },
          { wolof: "cin", french: "la marmite", article: "li" },
        ],
        explanation: "Chaque nom a sa consonne de classe : kër gi, nit ki, fas wi, cin li.",
      },
    ],
  },
};
