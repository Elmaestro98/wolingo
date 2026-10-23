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
  /** Prononciation « à la française » (ex. « man-gui fii ») */
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

// ---------------------------------------------------------------------------
// Fiches d'explication riches (maquettes 06 et 07) : une fiche = une liste de BLOCS
// ---------------------------------------------------------------------------

/** Une case de règle : « b + i = bi » / « ici, tout près » (+ un exemple facultatif). */
export type RuleTile = {
  formula: string;
  meaning: string;
  example?: string;
  exampleTranslation?: string;
  /** Couleur de la case : vert (proche) ou jaune (loin) */
  tone: "green" | "yellow";
};

/** Un nom illustré pour le bloc « Ici / Là-bas » : l'article est CALCULÉ (consonne + i ou a). */
export type NounExample = {
  noun: string;
  /** Consonne de classe : « b » → bi (ici) / ba (là-bas) */
  classLetter: string;
  image: ContentImageName;
  /** Traduction quand c'est tout près… */
  near: string;
  /** …et quand c'est plus loin */
  far: string;
};

/** Une ligne de conjugaison : « man » → « ma » + « ngi » = mangi. */
export type ConjugationRow = {
  pronoun: string;
  pronounFrench: string;
  stem: string;
  /** La terminaison, mise en valeur */
  ending: string;
  french: string;
};

/** Une étiquette sous le mot (ex. « Classe g »). `highlight` = mise en avant en vert. */
export type WordTag = { label: string; highlight?: boolean };

/**
 * Le SENS de la distance d'un article (pas une icône !).
 * C'est le composant qui choisit l'icône : le contenu reste lisible par un relecteur wolof.
 */
export type ArticleDistance = "near" | "there" | "mentioned" | "far";

/** Une ligne du bloc « les articles d'un mot » : kër + gi = la maison ici. */
export type ArticleForm = {
  article: string;
  distance: ArticleDistance;
  /** Petite étiquette (ex. « Ici · proche ») */
  label: string;
  french: string;
};

/** Un exemple wolof en contexte, avec une remarque facultative. */
export type ContextExample = {
  wolof: string;
  french: string;
  note?: string;
};

/** Les blocs possibles dans une fiche. Encore une union discriminée, par le champ `type`. */
export type CardBlock =
  | { type: "rule"; title: string; text?: string; tiles: RuleTile[] }
  | { type: "tip"; speaker: string; image?: ContentImageName; text: string }
  | { type: "noun_examples"; title: string; nouns: NounExample[] }
  | { type: "conjugation"; title: string; rows: ConjugationRow[] }
  // ---- Blocs de la fiche mot (maquette 09) ----
  | {
      type: "word_header";
      image: ContentImageName;
      word: string;
      phonetic: string;
      partOfSpeech: string;
      translation: string;
      definition: string;
      tags: WordTag[];
      /** Note culturelle facultative */
      culturalNote?: string;
    }
  | {
      type: "article_forms";
      title: string;
      text: string;
      word: string;
      forms: ArticleForm[];
      pluralNote?: string;
    }
  | { type: "context_examples"; title: string; examples: ContextExample[] }
  | { type: "related_words"; title: string; words: Example[] };

/** Étape « fiche » : une explication riche faite de blocs (pas un exercice). */
export type LessonCardStepData = {
  type: "lesson_card";
  eyebrow: string;
  /** Facultatif : une fiche mot n'a pas de titre, le mot lui-même sert de titre */
  title?: string;
  intro?: string;
  blocks: CardBlock[];
};

/** Un montant proposé : son nom en wolof et sa valeur en dërëm. */
export type DeremChoice = {
  wolof: string;
  derem: number;
};

/**
 * Exercice « dërëm » : dire un prix en F CFA avec la monnaie du marché (1 dërëm = 5 F CFA).
 * Pas d'answerIndex : la bonne réponse est CALCULÉE (celle qui vaut priceCfa ÷ 5).
 */
export type DeremStepData = {
  type: "derem";
  eyebrow: string;
  question: string;
  image: ContentImageName;
  priceCfa: number;
  choices: DeremChoice[];
  explanation: string;
};

/**
 * Une étape de leçon : une « union discriminée ». Le `|` veut dire « ou » :
 * une étape est SOIT une explication, SOIT un QCM, SOIT une phrase à compléter, SOIT des paires,
 * SOIT une phrase à construire, SOIT une phrase à écrire, SOIT un prix en dërëm.
 * Le champ `type` dit laquelle.
 */
export type LessonStep =
  | ExplanationStepData
  | LessonCardStepData
  | MultipleChoiceStepData
  | FillBlankStepData
  | MatchPairsStepData
  | BuildSentenceStepData
  | WriteTranslationStepData
  | DeremStepData;

export type Lesson = {
  id: string;
  title: string;
  steps: LessonStep[];
  /** Mots nouveaux de la leçon, affichés sur l'écran « Leçon terminée » */
  newWords: Example[];
};

/** Toutes les leçons, rangées par id pour les retrouver directement : LESSONS["u1-l3"]. */
export const LESSONS: Record<string, Lesson> = {
  // ---------------------------------------------------------------------------
  // Module 1 · Leçon 1 : les salutations
  // ⚠️ Première version (wolof de base, orthographe du cours) : À FAIRE VALIDER par le relecteur natif.
  // ---------------------------------------------------------------------------
  "u1-l1": {
    id: "u1-l1",
    title: "Salutations",
    newWords: [
      { wolof: "Nanga def ?", french: "Comment vas-tu ?" },
      { wolof: "rekk", french: "seulement, juste" },
      { wolof: "Jërëjëf", french: "merci" },
      { wolof: "Ba beneen yoon", french: "à la prochaine" },
    ],
    steps: [
      {
        type: "lesson_card",
        eyebrow: "Module 1 · Leçon 1",
        title: "Les salutations",
        intro: "Au Sénégal, on ne parle jamais à quelqu'un sans l'avoir salué d'abord.",
        blocks: [
          {
            type: "tip",
            speaker: "Awa",
            image: "awa",
            text: "on salue toujours avant de demander quoi que ce soit : au marché, dans un taxi, chez les voisins.",
          },
          {
            type: "context_examples",
            title: "Le dialogue de base",
            examples: [
              {
                wolof: "Salaam aleekum",
                french: "Que la paix soit sur vous.",
                note: "Pour saluer en arrivant",
              },
              { wolof: "Maaleekum salaam", french: "Et sur vous la paix.", note: "La réponse" },
              { wolof: "Nanga def ?", french: "Comment vas-tu ?" },
              {
                wolof: "Mangi fii rekk",
                french: "Je suis là, tout simplement.",
                note: "La réponse la plus courante : « ça va »",
              },
            ],
          },
          {
            type: "related_words",
            title: "Mots utiles",
            words: [
              { wolof: "Jërëjëf", french: "merci" },
              { wolof: "Ba beneen yoon", french: "à la prochaine" },
              { wolof: "Waaw", french: "oui" },
              { wolof: "Déedéet", french: "non" },
            ],
          },
        ],
      },
      {
        type: "multiple_choice",
        eyebrow: "Nouveau mot",
        question: "Que veut dire cette phrase ?",
        prompt: "Nanga def ?",
        context: "La question qu'on pose juste après s'être salués",
        image: "man",
        choices: ["Comment vas-tu ?", "Merci", "À la prochaine", "Je suis ici"],
        answerIndex: 0,
        explanation: "Nanga def ? = comment vas-tu ? On y répond très souvent : Mangi fii rekk.",
      },
      {
        type: "fill_blank",
        eyebrow: "Salutations",
        question: "Complète la salutation",
        speaker: { name: "Awa", subtitle: "te salue en arrivant", image: "awa" },
        before: "Salaam",
        after: "",
        translation: "Que la paix soit sur vous",
        choicesLabel: "Choisis le mot",
        choices: ["rekk", "aleekum", "def", "fii"],
        answerIndex: 1,
        hint: "C'est la formule de paix qu'on dit en entrant.",
        explanation: "Salaam aleekum : la salutation de base. On y répond Maaleekum salaam.",
      },
      {
        type: "build_sentence",
        eyebrow: "Salutations",
        question: "Réponds à « Nanga def ? »",
        sourceText: "Je suis là, tout simplement (ça va).",
        answer: ["Mangi", "fii", "rekk"],
        tiles: ["rekk", "Nanga", "Mangi", "def", "fii"],
        explanation: "Mangi fii rekk : mot à mot « je suis là, seulement ». C'est le « ça va » du wolof.",
      },
      {
        type: "write_translation",
        eyebrow: "Traduction écrite",
        question: "Écris ce mot en wolof",
        speaker: { name: "Awa", image: "awa" },
        sourceText: "Merci !",
        acceptedAnswers: ["Jërëjëf"],
        hint: "Jë-rë-jëf : trois fois la lettre ë.",
        explanation: "Jërëjëf = merci. Le ë se prononce comme le « e » de « le ».",
      },
      {
        type: "multiple_choice",
        eyebrow: "Pour partir",
        question: "Que veut dire cette phrase ?",
        prompt: "Ba beneen yoon",
        choices: ["À la prochaine", "Bonjour", "Merci beaucoup", "Comment vas-tu ?"],
        answerIndex: 0,
        explanation: "Ba beneen yoon = « jusqu'à une autre fois » : à la prochaine !",
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Module 1 · Leçon 2 : les pronoms isolés (tableau de la maquette 07)
  // ⚠️ À FAIRE VALIDER par le relecteur natif.
  // ---------------------------------------------------------------------------
  "u1-l2": {
    id: "u1-l2",
    title: "Pronoms",
    newWords: [
      { wolof: "man", french: "moi" },
      { wolof: "yow", french: "toi" },
      { wolof: "ñun", french: "nous" },
      { wolof: "yéen", french: "vous" },
    ],
    steps: [
      {
        type: "lesson_card",
        eyebrow: "Module 1 · Leçon 2",
        title: "Les pronoms",
        intro:
          "Les pronoms isolés servent à dire « moi », « toi », « nous »… Ils sont la base du présent : mangi vient de man.",
        blocks: [
          {
            type: "related_words",
            title: "Les 6 pronoms",
            words: [
              { wolof: "man", french: "moi, je" },
              { wolof: "yow", french: "toi, tu" },
              { wolof: "moom", french: "lui, elle" },
              { wolof: "ñun", french: "nous" },
              { wolof: "yéen", french: "vous" },
              { wolof: "ñoom", french: "eux, elles" },
            ],
          },
          {
            type: "rule",
            title: "Du pronom au verbe « être là »",
            text: "On garde le début du pronom et on ajoute -ngi.",
            tiles: [
              {
                formula: "man → mangi",
                meaning: "me voici",
                example: "Mangi fii",
                exampleTranslation: "Je suis ici",
                tone: "green",
              },
              {
                formula: "yow → yangi",
                meaning: "te voici",
                example: "Yangi fii",
                exampleTranslation: "Tu es ici",
                tone: "yellow",
              },
            ],
          },
        ],
      },
      {
        type: "multiple_choice",
        eyebrow: "Nouveau mot",
        question: "Que veut dire ce pronom ?",
        prompt: "yéen",
        choices: ["vous", "nous", "eux", "toi"],
        answerIndex: 0,
        explanation: "yéen = vous. Attention : ñun = nous, ñoom = eux.",
      },
      {
        type: "multiple_choice",
        eyebrow: "Pronoms",
        question: "Que veut dire ce pronom ?",
        prompt: "ñoom",
        choices: ["nous", "eux, elles", "lui", "moi"],
        answerIndex: 1,
        explanation: "ñoom = eux, elles. ñun (nous) et ñoom (eux) se ressemblent : regarde la fin du mot !",
      },
      {
        type: "fill_blank",
        eyebrow: "Pronoms",
        question: "Complète : « Te voici ! »",
        speaker: { name: "Awa", subtitle: "t'accueille", image: "awa" },
        before: "",
        after: "fii",
        translation: "Tu es là, te voici",
        choicesLabel: "Choisis la forme",
        choices: ["Mangi", "Yangi", "Mungi", "Ñungi"],
        answerIndex: 1,
        hint: "« Tu » se dit yow : on garde « ya ».",
        explanation: "yow → ya + ngi = yangi : tu es là, te voici.",
      },
      {
        type: "build_sentence",
        eyebrow: "Pronoms",
        question: "Construis la phrase en wolof",
        sourceText: "Il est ici.",
        answer: ["Mungi", "fii"],
        tiles: ["Yangi", "fii", "Mungi", "dem"],
        explanation: "moom (lui) → mu + ngi = mungi : il / elle est là.",
      },
      {
        type: "write_translation",
        eyebrow: "Traduction écrite",
        question: "Écris cette phrase en wolof",
        speaker: { name: "Awa", image: "awa" },
        sourceText: "Me voici ici.",
        acceptedAnswers: ["Mangi fii"],
        hint: "man → ma + ngi · ici = fii",
        explanation: "Mangi fii : je suis là, me voici ici.",
      },
    ],
  },

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
        // Fiche de la maquette 07 : rappel du présent démonstratif avant la forme progressive
        type: "lesson_card",
        eyebrow: "Point grammaire · Rappel",
        title: "Le présent démonstratif",
        intro: "Pour dire où l'on se trouve, ou annoncer ce qu'on fait en ce moment.",
        blocks: [
          {
            type: "tip",
            speaker: "Awa",
            image: "awa",
            text: "c'est le temps du « me voici ! ». Repère la terminaison -ngi, elle ne change jamais.",
          },
          {
            type: "conjugation",
            title: "Conjugaison",
            rows: [
              {
                pronoun: "man",
                pronounFrench: "moi, je",
                stem: "ma",
                ending: "ngi",
                french: "je suis là, me voici",
              },
              {
                pronoun: "yow",
                pronounFrench: "toi, tu",
                stem: "ya",
                ending: "ngi",
                french: "tu es là, te voici",
              },
              {
                pronoun: "moom",
                pronounFrench: "lui, elle",
                stem: "mu",
                ending: "ngi",
                french: "il / elle est là",
              },
              { pronoun: "ñun", pronounFrench: "nous", stem: "ñu", ending: "ngi", french: "nous sommes là" },
              {
                pronoun: "yéen",
                pronounFrench: "vous",
                stem: "yééna",
                ending: "ngi",
                french: "vous êtes là",
              },
              {
                pronoun: "ñoom",
                pronounFrench: "eux, elles",
                stem: "ñu",
                ending: "ngi",
                french: "ils / elles sont là",
              },
            ],
          },
          {
            type: "rule",
            title: "Proche ou éloigné ?",
            tiles: [
              {
                formula: "-ngi",
                meaning: "voici · tout près",
                example: "Mangi fii",
                exampleTranslation: "Me voici ici",
                tone: "green",
              },
              {
                formula: "-ngë",
                meaning: "voilà · plus loin",
                example: "Mangë fale",
                exampleTranslation: "Me voilà là-bas",
                tone: "yellow",
              },
            ],
          },
        ],
      },
      {
        type: "explanation",
        eyebrow: "Point grammaire",
        title: "Ce qu'on fait en ce moment",
        text: "Pour dire qu'une action est en train de se faire, le présent démonstratif prend la forme progressive : mangi devient mangiy.",
        examples: [{ wolof: "Mangi fii", french: "Je suis ici" }],
      },
      {
        type: "multiple_choice",
        eyebrow: "Nouveau mot",
        question: "Que veut dire cette phrase ?",
        prompt: "Mangi fii",
        pronunciation: "man-gui fii",
        context: "Réponse courante à « Nanga def ? »",
        image: "man",
        choices: ["Je suis ici", "Il est là-bas", "Tu es assis", "Nous partons"],
        answerIndex: 0,
        explanation: "Fii = ici même. Pour un endroit éloigné, on dit fale : Mangë fale.",
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
        choices: [
          "Diop est ici",
          "Diop est en train de s'en aller",
          "Diop mange la feuille",
          "Je prends mon livre",
        ],
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
    ],
  },

  // ---------------------------------------------------------------------------
  // Module 1 · Leçon 4 : les classes nominales et la distance (maquettes 06, 09 et 11)
  // ---------------------------------------------------------------------------
  "u1-l4": {
    id: "u1-l4",
    title: "Voici & voilà",
    newWords: [
      { wolof: "bunt", french: "porte" },
      { wolof: "cin", french: "marmite" },
      { wolof: "nit", french: "personne" },
      { wolof: "fas", french: "cheval" },
    ],
    steps: [
      {
        // Fiche de la maquette 06
        type: "lesson_card",
        eyebrow: "Découverte · Carnet de Dakar",
        title: "Les classes nominales",
        blocks: [
          {
            type: "rule",
            title: "La règle d'or",
            text: "Chaque nom a une consonne de classe. Ajoute une voyelle pour former l'article : elle indique la distance.",
            tiles: [
              { formula: "b + i = bi", meaning: "ici, tout près", tone: "green" },
              { formula: "b + a = ba", meaning: "là-bas, plus loin", tone: "yellow" },
            ],
          },
          {
            type: "noun_examples",
            title: "Exemples du quotidien",
            nouns: [
              {
                noun: "bunt",
                classLetter: "b",
                image: "door",
                near: "cette porte-ci (tout près)",
                far: "cette porte-là (plus loin)",
              },
              {
                noun: "cin",
                classLetter: "l",
                image: "pot",
                near: "cette marmite-ci (sur le feu)",
                far: "cette marmite-là (plus loin)",
              },
              {
                noun: "nit",
                classLetter: "k",
                image: "person",
                near: "cette personne-ci (l'humain)",
                far: "cette personne-là (plus loin)",
              },
            ],
          },
          {
            type: "tip",
            speaker: "Astuce du taxi jaune-noir",
            text: "les mots empruntés prennent presque tous l'article bi : taksi bi, otool bi.",
          },
        ],
      },
      {
        // Fiche mot de la maquette 09 : les 4 degrés de distance (cahier : « i / ë / oo-u / ëlé »)
        type: "lesson_card",
        eyebrow: "Nouveau mot",
        blocks: [
          {
            type: "word_header",
            image: "house",
            word: "kër",
            phonetic: "kër",
            partOfSpeech: "nom",
            translation: "maison",
            definition: "demeure, foyer, concession familiale",
            tags: [
              { label: "Classe g", highlight: true },
              { label: "Pluriel : kër yi" },
              { label: "Très courant" },
            ],
            culturalNote:
              "Au Sénégal, kër désigne bien plus qu'un bâtiment : c'est le foyer, l'espace où résonne la Teranga.",
          },
          {
            type: "article_forms",
            title: "Les 4 articles de kër",
            text: "L'article prend la consonne de classe g et change selon la distance. Touche une ligne pour la voir.",
            word: "kër",
            forms: [
              {
                article: "gi",
                distance: "near",
                label: "Ici · proche",
                french: "La maison juste à côté, ici même",
              },
              {
                article: "gë",
                distance: "there",
                label: "Là-bas",
                french: "La maison qu'on voit, un peu plus loin",
              },
              {
                article: "googu",
                distance: "mentioned",
                label: "Déjà mentionnée",
                french: "Cette maison dont on a parlé",
              },
              {
                article: "gëlé",
                distance: "far",
                label: "Au loin",
                french: "La maison tout là-bas, à l'horizon",
              },
            ],
            pluralNote: "Au pluriel (classe y) : kër yi · kër yë · kër yooyu · kër yëlé",
          },
          {
            type: "context_examples",
            title: "En contexte",
            examples: [
              {
                wolof: "Job ak Juf angi toog ci kër gi",
                french: "Diop et Diouf sont assis dans cette maison.",
                note: "Présent locatif : angi + article gi",
              },
              {
                wolof: "Kër gu mag la",
                french: "C'est une grande maison.",
                note: "Souvent la grande concession familiale où vivent plusieurs générations.",
              },
            ],
          },
          {
            type: "related_words",
            title: "Mots de la même famille",
            words: [
              { wolof: "borom kër", french: "chef de famille" },
              { wolof: "waa kër", french: "les gens de la maison" },
              { wolof: "kër doktóor", french: "dispensaire" },
            ],
          },
        ],
      },
      {
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
      {
        type: "multiple_choice",
        eyebrow: "Nouveau mot",
        question: "Que veut dire ce groupe de mots ?",
        prompt: "kër gi",
        choices: ["la maison juste à côté", "la maison là-bas", "la personne ici", "le cheval là-bas"],
        answerIndex: 0,
        explanation: "g est la consonne de classe de kër, et i indique que la maison est tout près.",
      },
      {
        type: "fill_blank",
        eyebrow: "Classes nominales",
        question: "Complète avec le bon article",
        speaker: { name: "Awa", subtitle: "te présente quelqu'un", image: "awa" },
        before: "nit",
        after: "",
        translation: "cette personne-ci",
        choicesLabel: "Choisis l'article",
        choices: ["gi", "ki", "li", "wi"],
        answerIndex: 1,
        hint: "Les personnes sont dans la classe k.",
        explanation: "Les personnes sont dans la classe k : nit ki.",
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Module 1 · Leçon 5 : le pluriel (cahier des charges : « pluriel y/ñ »)
  // ⚠️ À FAIRE VALIDER par le relecteur natif.
  // ---------------------------------------------------------------------------
  "u1-l5": {
    id: "u1-l5",
    title: "Le pluriel",
    newWords: [
      { wolof: "kër yi", french: "les maisons (ici)" },
      { wolof: "nit ñi", french: "les gens (ici)" },
      { wolof: "xar yi", french: "les moutons (ici)" },
      { wolof: "bunt yi", french: "les portes (ici)" },
    ],
    steps: [
      {
        type: "lesson_card",
        eyebrow: "Module 1 · Leçon 5",
        title: "Le pluriel",
        intro: "Au pluriel, plus besoin de retenir la classe du nom : il n'y a que deux consonnes.",
        blocks: [
          {
            type: "rule",
            title: "La règle du pluriel",
            text: "La consonne de classe devient y pour presque tous les noms, et ñ pour les personnes.",
            tiles: [
              { formula: "kër gi → kër yi", meaning: "y : les choses, les animaux", tone: "green" },
              { formula: "nit ki → nit ñi", meaning: "ñ : les personnes", tone: "yellow" },
            ],
          },
          {
            type: "noun_examples",
            title: "Au pluriel",
            nouns: [
              { noun: "bunt", classLetter: "y", image: "door", near: "ces portes-ci", far: "ces portes-là" },
              {
                noun: "cin",
                classLetter: "y",
                image: "pot",
                near: "ces marmites-ci",
                far: "ces marmites-là",
              },
              {
                noun: "nit",
                classLetter: "ñ",
                image: "person",
                near: "ces personnes-ci",
                far: "ces personnes-là",
              },
            ],
          },
          {
            type: "tip",
            speaker: "Awa",
            image: "awa",
            text: "la voyelle garde son sens au pluriel : yi = ici, ya = là-bas. Comme au singulier !",
          },
        ],
      },
      {
        type: "multiple_choice",
        eyebrow: "Le pluriel",
        question: "Que veut dire ce groupe de mots ?",
        prompt: "nit ñi",
        image: "man",
        choices: ["ces personnes-ci", "cette personne-ci", "ces maisons-ci", "ces personnes-là"],
        answerIndex: 0,
        explanation: "ñ = pluriel des personnes, i = ici : nit ñi, ces personnes-ci.",
      },
      {
        type: "fill_blank",
        eyebrow: "Le pluriel",
        question: "Mets au pluriel",
        speaker: { name: "Baye le mouton", subtitle: "présente sa famille", image: "sheep" },
        before: "xar",
        after: "",
        translation: "ces moutons-ci",
        choicesLabel: "Choisis l'article",
        choices: ["bi", "yi", "ñi", "ki"],
        answerIndex: 1,
        hint: "Un mouton n'est pas une personne…",
        explanation: "Les animaux et les choses prennent y au pluriel : xar yi.",
      },
      {
        type: "fill_blank",
        eyebrow: "Le pluriel",
        question: "Mets au pluriel",
        speaker: { name: "Awa", subtitle: "montre ses voisins", image: "awa" },
        before: "nit",
        after: "",
        translation: "ces personnes-ci",
        choicesLabel: "Choisis l'article",
        choices: ["ki", "yi", "ñi", "gi"],
        answerIndex: 2,
        hint: "Ce sont des personnes.",
        explanation: "Les personnes prennent ñ au pluriel : nit ñi.",
      },
      {
        type: "write_translation",
        eyebrow: "Traduction écrite",
        question: "Écris en wolof",
        speaker: { name: "Awa", image: "awa" },
        sourceText: "ces maisons-ci",
        acceptedAnswers: ["kër yi"],
        hint: "maison = kër · pluriel des choses = y · ici = i",
        explanation: "kër gi au singulier → kër yi au pluriel.",
      },
    ],
  },

  // ===========================================================================
  // MODULE 2 · Pronoms objets et relatifs
  // Source : « Initiation au Wolof — Méthode rapide » (Xavier Bry), UNITÉ 2.
  // Orthographe du cours, sauf η (lettre grecque dans le PDF) remplacé par ŋ (la lettre wolof).
  // ===========================================================================

  // ---- Leçon 1 : les pronoms personnels objets (unité 2, § 1) ----
  "u2-l1": {
    id: "u2-l1",
    title: "Pronoms objets",
    newWords: [
      { wolof: "më", french: "me" },
      { wolof: "lë", french: "te" },
      { wolof: "ko", french: "le, la" },
      { wolof: "léén", french: "vous, les" },
    ],
    steps: [
      {
        type: "lesson_card",
        eyebrow: "Module 2 · Leçon 1",
        title: "Les pronoms objets",
        intro: "Pour dire « me », « te », « le »… Ils se placent avant le verbe.",
        blocks: [
          {
            type: "conjugation",
            title: "Les pronoms personnels objets",
            rows: [
              { pronoun: "me", pronounFrench: "moi", stem: "më", ending: "", french: "il me regarde…" },
              { pronoun: "te", pronounFrench: "toi", stem: "lë", ending: "", french: "il te regarde…" },
              {
                pronoun: "le, la",
                pronounFrench: "lui, elle",
                stem: "ko",
                ending: "",
                french: "il le / la regarde…",
              },
              { pronoun: "nous", pronounFrench: "nous", stem: "ñu", ending: "", french: "il nous regarde…" },
              {
                pronoun: "vous",
                pronounFrench: "vous",
                stem: "léén",
                ending: "",
                french: "il vous regarde…",
              },
              {
                pronoun: "les",
                pronounFrench: "eux, elles",
                stem: "léén",
                ending: "",
                french: "il les regarde…",
              },
            ],
          },
          {
            type: "tip",
            speaker: "Awa",
            image: "awa",
            text: "léén veut dire à la fois « vous » et « les » : c'est la phrase qui dit lequel.",
          },
        ],
      },
      {
        type: "multiple_choice",
        eyebrow: "Pronoms objets",
        question: "Que veut dire ce pronom ?",
        prompt: "ko",
        choices: ["le, la", "me", "nous", "vous"],
        answerIndex: 0,
        explanation: "ko = le ou la : yaŋ koy lekk, tu es en train de LE manger.",
      },
      {
        type: "match_pairs",
        eyebrow: "Pronoms objets",
        question: "Associe chaque pronom à sa forme wolof",
        instruction: "Touche un pronom français, puis sa forme wolof.",
        pairs: [
          { wolof: "me", french: "pronom objet", article: "më" },
          { wolof: "te", french: "pronom objet", article: "lë" },
          { wolof: "le, la", french: "pronom objet", article: "ko" },
          { wolof: "nous", french: "pronom objet", article: "ñu" },
        ],
        explanation: "me = më, te = lë, le / la = ko, nous = ñu.",
      },
      {
        type: "multiple_choice",
        eyebrow: "Pronoms objets",
        question: "Que veut dire ce pronom ?",
        prompt: "léén",
        choices: ["vous, les", "nous", "te", "le, la"],
        answerIndex: 0,
        explanation: "léén = vous ou les, selon la phrase.",
      },
      {
        type: "write_translation",
        eyebrow: "Traduction écrite",
        question: "Écris ce pronom en wolof",
        speaker: { name: "Awa", image: "awa" },
        sourceText: "te (pronom objet)",
        acceptedAnswers: ["lë"],
        hint: "Deux lettres : l + ë.",
        explanation: "te = lë : muŋ lëy gungé, il T'accompagne.",
      },
    ],
  },

  // ---- Leçon 2 : le présent progressif avec un pronom objet (unité 2, § 1) ----
  "u2-l2": {
    id: "u2-l2",
    title: "Le progressif",
    newWords: [
      { wolof: "gungé", french: "accompagner" },
      { wolof: "bayyi", french: "laisser" },
      { wolof: "jang", french: "lire" },
      { wolof: "def", french: "faire" },
    ],
    steps: [
      {
        type: "lesson_card",
        eyebrow: "Module 2 · Leçon 2",
        title: "Je suis en train de le…",
        intro: "Pour dire « je suis en train de le faire », on glisse le pronom objet entre ngi et le verbe.",
        blocks: [
          {
            type: "rule",
            title: "La construction",
            text: "Sujet + ngi / ngë + pronom objet + y (= di) + verbe. À l'oral, le i de ngi tombe : il reste ŋ.",
            tiles: [
              {
                formula: "yangi + ko + y + lekk",
                meaning: "forme complète",
                example: "Yaŋ koy lekk",
                exampleTranslation: "Tu es en train de le manger",
                tone: "green",
              },
              {
                formula: "ngi → ŋ",
                meaning: "forme de tous les jours",
                example: "Ñuŋ koy jang",
                exampleTranslation: "Nous sommes / ils sont en train de le lire",
                tone: "yellow",
              },
            ],
          },
          {
            type: "context_examples",
            title: "Exemples du cours",
            examples: [
              { wolof: "Muŋ lëy gungé", french: "Il t'accompagne." },
              { wolof: "Maŋ léény bayyi", french: "Je vous laisse." },
              { wolof: "Taksi baŋ mëy bayyi", french: "Ce taxi me laisse." },
              { wolof: "Maŋ lë koy wax", french: "Je suis en train de te le dire." },
              { wolof: "Joob aŋ koy def", french: "Diop est en train de le faire." },
            ],
          },
          {
            type: "tip",
            speaker: "Awa",
            image: "awa",
            text: "le y (abréviation de di) se colle toujours juste avant le verbe : koy, lëy, mëy, léény.",
          },
        ],
      },
      {
        type: "multiple_choice",
        eyebrow: "Le progressif",
        question: "Que veut dire cette phrase ?",
        prompt: "Muŋ lëy gungé",
        choices: ["Il t'accompagne", "Je te laisse", "Tu le manges", "Nous le lisons"],
        answerIndex: 0,
        explanation: "mu + ŋ (il) + lë + y (te) + gungé (accompagner) : il t'accompagne.",
      },
      {
        type: "build_sentence",
        eyebrow: "Le progressif",
        question: "Construis la phrase en wolof",
        sourceText: "Tu es en train de le manger.",
        answer: ["Yaŋ", "koy", "lekk"],
        tiles: ["koy", "lekk", "Maŋ", "Yaŋ", "lëy"],
        explanation: "yangi + ko + y + lekk → yaŋ koy lekk.",
      },
      {
        type: "fill_blank",
        eyebrow: "Le progressif",
        question: "Complète la phrase",
        speaker: { name: "Awa", subtitle: "te dit au revoir", image: "awa" },
        before: "Maŋ",
        after: "bayyi",
        translation: "Je vous laisse",
        choicesLabel: "Choisis le pronom",
        choices: ["léény", "koy", "lëy", "mëy"],
        answerIndex: 0,
        hint: "« vous » se dit léén, et le y vient juste avant le verbe.",
        explanation: "léén (vous) + y = léény : maŋ léény bayyi, je vous laisse.",
      },
      {
        type: "multiple_choice",
        eyebrow: "Le progressif",
        question: "Que veut dire cette phrase ?",
        prompt: "Taksi baŋ mëy bayyi",
        choices: ["Ce taxi me laisse", "Ce taxi te laisse", "Je laisse ce taxi", "Ce taxi le laisse"],
        answerIndex: 0,
        explanation: "më + y = mëy : ce taxi ME laisse.",
      },
      {
        type: "write_translation",
        eyebrow: "Traduction écrite",
        question: "Écris cette phrase en wolof",
        speaker: { name: "Awa", image: "awa" },
        sourceText: "Diop est en train de le faire.",
        acceptedAnswers: ["Joob aŋ koy def"],
        hint: "Diop = Joob · le = ko · faire = def. Pense au ŋ du clavier wolof !",
        explanation: "Joob + aŋ (a + ngi) + koy + def : Diop est en train de le faire.",
      },
    ],
  },

  // ---- Leçon 3 : le pronom relatif sujet « qui » (unité 2, § 2) ----
  "u2-l3": {
    id: "u2-l3",
    title: "Le relatif « qui »",
    newWords: [
      { wolof: "rafet", french: "joli" },
      { wolof: "yomb", french: "bon marché, facile" },
      { wolof: "jafé", french: "cher, difficile" },
      { wolof: "ndaw", french: "petit" },
    ],
    steps: [
      {
        type: "lesson_card",
        eyebrow: "Module 2 · Leçon 3",
        title: "Le relatif « qui »",
        intro: "Pour dire « la fille qui… », « la maison qui… ».",
        blocks: [
          {
            type: "rule",
            title: "La règle",
            text: "On prend la consonne de classe du nom, et on lui donne la terminaison u.",
            tiles: [
              {
                formula: "j + u = ju",
                meaning: "jiggéén (j)",
                example: "jiggéén ju rafet",
                exampleTranslation: "une jolie femme",
                tone: "green",
              },
              {
                formula: "g + u = gu",
                meaning: "kër (g)",
                example: "kër gu ndaw",
                exampleTranslation: "une petite maison",
                tone: "yellow",
              },
            ],
          },
          {
            type: "context_examples",
            title: "Exemples du cours",
            examples: [
              {
                wolof: "Mangiy jend cin lu yomb",
                french: "Je suis en train d'acheter une marmite bon marché.",
              },
              { wolof: "Yangi jel jën wu jafé bi", french: "Tu prends ce poisson cher-ci." },
              {
                wolof: "Taksi bu dem baangiy ñowaat",
                french: "Le taxi qui est parti revient.",
                note: "Le relatif marche aussi avec un verbe : bu dem = qui est parti",
              },
            ],
          },
          {
            type: "tip",
            speaker: "Awa",
            image: "awa",
            text: "un adjectif se construit comme un verbe : jiggéén ju rafet = une femme qui est jolie.",
          },
        ],
      },
      {
        type: "match_pairs",
        eyebrow: "Le relatif « qui »",
        question: "Associe chaque nom à son relatif",
        instruction: "Touche un nom, puis le relatif qui va avec.",
        pairs: [
          { wolof: "jiggéén", french: "la femme", article: "ju" },
          { wolof: "cin", french: "la marmite", article: "lu" },
          { wolof: "jën", french: "le poisson", article: "wu" },
          { wolof: "kër", french: "la maison", article: "gu" },
        ],
        explanation: "Consonne de classe + u : jiggéén ju, cin lu, jën wu, kër gu.",
      },
      {
        type: "fill_blank",
        eyebrow: "Le relatif « qui »",
        question: "Complète avec le bon relatif",
        speaker: { name: "Awa", subtitle: "décrit sa maison", image: "awa" },
        before: "kër",
        after: "ndaw",
        translation: "une petite maison",
        choicesLabel: "Choisis le relatif",
        choices: ["gu", "ju", "bu", "wu"],
        answerIndex: 0,
        hint: "kër gi : la consonne de classe est g.",
        explanation: "kër est de la classe g → gu : kër gu ndaw.",
      },
      {
        type: "multiple_choice",
        eyebrow: "Le relatif « qui »",
        question: "Que veut dire ce groupe de mots ?",
        prompt: "Jiggéén ju rafet ji",
        image: "person",
        choices: ["Cette jolie femme", "Une femme laide", "La femme qui part", "Une petite fille"],
        answerIndex: 0,
        explanation: "ju rafet = qui est jolie ; ji à la fin = cette… ci.",
      },
      {
        type: "fill_blank",
        eyebrow: "Le relatif « qui »",
        question: "Complète avec le bon relatif",
        speaker: { name: "Awa", subtitle: "attend un taxi", image: "awa" },
        before: "Taksi",
        after: "mboq",
        translation: "un taxi jaune",
        choicesLabel: "Choisis le relatif",
        choices: ["bu", "gu", "ju", "lu"],
        answerIndex: 0,
        hint: "On dit taksi bi : la consonne de classe est b.",
        explanation: "taksi est de la classe b → bu : taksi bu mboq.",
      },
    ],
  },

  // ---- Leçon 4 : vocabulaire du marché + phrases de la Version (unité 2) ----
  "u2-l4": {
    id: "u2-l4",
    title: "Au marché",
    newWords: [
      { wolof: "jend", french: "acheter" },
      { wolof: "jaay", french: "vendre" },
      { wolof: "waxalé", french: "marchander" },
      { wolof: "tey", french: "aujourd'hui" },
    ],
    steps: [
      {
        type: "lesson_card",
        eyebrow: "Module 2 · Leçon 4",
        title: "Au marché",
        intro: "Le vocabulaire de l'unité 2 pour faire tes courses… et marchander !",
        blocks: [
          {
            type: "related_words",
            title: "Acheter et vendre",
            words: [
              { wolof: "jend", french: "acheter" },
              { wolof: "jaay", french: "vendre" },
              { wolof: "waxalé", french: "marchander" },
              { wolof: "ja", french: "marché" },
              { wolof: "bari", french: "beaucoup" },
              { wolof: "tey", french: "aujourd'hui" },
            ],
          },
          {
            type: "related_words",
            title: "Les adjectifs",
            words: [
              { wolof: "rafet", french: "joli" },
              { wolof: "ñaaw", french: "laid" },
              { wolof: "jafé", french: "cher" },
              { wolof: "yomb", french: "bon marché" },
              { wolof: "ndaw", french: "petit" },
              { wolof: "rëy", french: "très grand" },
            ],
          },
        ],
      },
      {
        type: "multiple_choice",
        eyebrow: "Version du cours",
        question: "Que veut dire cette phrase ?",
        prompt: "Mungi jend jën wu bari tey.",
        choices: [
          "Il achète beaucoup de poisson aujourd'hui.",
          "Il vend du poisson cher.",
          "Je laisse le poisson ici.",
          "Il grille le poisson sur le feu.",
        ],
        answerIndex: 0,
        explanation: "jend = acheter, jën wu bari = du poisson qui est abondant, tey = aujourd'hui.",
      },
      {
        type: "build_sentence",
        eyebrow: "Version du cours",
        question: "Construis la phrase en wolof",
        sourceText: "Je te laisse ici.",
        answer: ["Maŋ", "lëy", "bayyi", "fii"],
        tiles: ["bayyi", "koy", "Maŋ", "fii", "jend", "lëy"],
        explanation: "Maŋ (je) + lëy (te) + bayyi (laisser) + fii (ici).",
      },
      {
        type: "multiple_choice",
        eyebrow: "Version du cours",
        question: "Que veut dire cette phrase ?",
        prompt: "Tey, Ndey angiy tog yapp bu bari.",
        choices: [
          "Aujourd'hui, Ndèye cuisine beaucoup de viande.",
          "Aujourd'hui, Ndèye achète du poisson.",
          "Ndèye vend beaucoup de viande.",
          "Ndèye allume un grand feu.",
        ],
        answerIndex: 0,
        explanation: "tog = cuisiner, yapp = viande, bu bari = beaucoup.",
      },
      {
        type: "write_translation",
        eyebrow: "Version du cours",
        question: "Écris cette phrase en wolof",
        speaker: { name: "Awa", image: "awa" },
        sourceText: "Il achète beaucoup de poisson aujourd'hui.",
        acceptedAnswers: ["Mungi jend jën wu bari tey"],
        hint: "il = mungi · acheter = jend · poisson = jën · beaucoup = wu bari · aujourd'hui = tey",
        explanation: "Mungi jend jën wu bari tey : la 1re phrase de la Version de l'unité 2.",
      },
    ],
  },

  // ===========================================================================
  // MODULE 3 · Possessif et accompli
  // Source : « Initiation au Wolof — Méthode rapide » (Xavier Bry), UNITÉ 3.
  // ⚠️ Pour le relecteur : page 10, « Yomb-ul : c'est bon marché » semble être une coquille
  //    (-ul = négation → « ce n'est pas bon marché ») : phrase volontairement non utilisée.
  // ===========================================================================

  // ---- Leçon 1 : les pronoms possessifs (unité 3, § 1) ----
  "u3-l1": {
    id: "u3-l1",
    title: "Le possessif",
    newWords: [
      { wolof: "sumë", french: "mon, ma" },
      { wolof: "sa", french: "ton, ta" },
      { wolof: "suñu", french: "notre" },
      { wolof: "séén", french: "votre, leur" },
    ],
    steps: [
      {
        type: "lesson_card",
        eyebrow: "Module 3 · Leçon 1",
        title: "Le possessif",
        intro: "Pour dire « mon livre », « ta maison »… Le possessif se place devant le nom.",
        blocks: [
          {
            type: "conjugation",
            title: "Les possessifs (un objet → plusieurs)",
            rows: [
              { pronoun: "mon, ma", pronounFrench: "mes", stem: "sumë", ending: "", french: "mes : sumey" },
              { pronoun: "ton, ta", pronounFrench: "tes", stem: "sa", ending: "", french: "tes : sey" },
              {
                pronoun: "son, sa",
                pronounFrench: "ses",
                stem: "nom + ",
                ending: "-am",
                french: "ses : ay + nom + -am",
              },
              { pronoun: "notre", pronounFrench: "nos", stem: "suñu", ending: "", french: "nos : suñuy" },
              { pronoun: "votre", pronounFrench: "vos", stem: "séén", ending: "", french: "vos : sééni" },
              { pronoun: "leur", pronounFrench: "leurs", stem: "séén", ending: "", french: "leurs : sééni" },
            ],
          },
          {
            type: "context_examples",
            title: "Exemples du cours",
            examples: [
              { wolof: "Mangi jel sumë tééré", french: "Je prends mon livre." },
              { wolof: "Mangi jel sumëy tééré", french: "Je prends mes livres." },
              {
                wolof: "Aysatu angiy dem këram",
                french: "Aïssatou s'en va chez elle.",
                note: "kër + -am = këram : sa maison à elle",
              },
              { wolof: "Abdu ak Sogé angi jel sééni tééré", french: "Abdou et Sogué prennent leurs livres." },
            ],
          },
          {
            type: "tip",
            speaker: "Awa",
            image: "awa",
            text: "« son » est le seul possessif qui se met APRÈS le nom : kër + am = këram, sa maison.",
          },
        ],
      },
      {
        type: "multiple_choice",
        eyebrow: "Le possessif",
        question: "Que veut dire cette phrase ?",
        prompt: "Mangi jel sumë tééré",
        choices: [
          "Je prends mon livre",
          "Je prends ton livre",
          "Je prends mes livres",
          "Tu prends mon livre",
        ],
        answerIndex: 0,
        explanation: "sumë = mon, ma : sumë tééré, mon livre.",
      },
      {
        type: "match_pairs",
        eyebrow: "Le possessif",
        question: "Associe chaque possessif à sa forme wolof",
        instruction: "Touche un possessif français, puis sa forme wolof.",
        pairs: [
          { wolof: "mon", french: "possessif", article: "sumë" },
          { wolof: "ton", french: "possessif", article: "sa" },
          { wolof: "notre", french: "possessif", article: "suñu" },
          { wolof: "votre", french: "possessif", article: "séén" },
        ],
        explanation: "mon = sumë, ton = sa, notre = suñu, votre (et leur) = séén.",
      },
      {
        type: "fill_blank",
        eyebrow: "Le possessif",
        question: "Complète la phrase",
        speaker: { name: "Awa", subtitle: "range ses affaires", image: "awa" },
        before: "Mangi jel",
        after: "tééré",
        translation: "Je prends mes livres",
        choicesLabel: "Choisis le possessif",
        choices: ["sumëy", "sumë", "sa", "sey"],
        answerIndex: 0,
        hint: "Plusieurs livres : le possessif prend un y.",
        explanation: "mes = sumey (sumëy) : mangi jel sumëy tééré, je prends mes livres.",
      },
      {
        type: "build_sentence",
        eyebrow: "Le possessif",
        question: "Construis la phrase en wolof",
        sourceText: "Je prends mon livre.",
        answer: ["Mangi", "jel", "sumë", "tééré"],
        tiles: ["sa", "tééré", "Mangi", "sumë", "jel", "suñu"],
        explanation: "Mangi jel (je prends) + sumë (mon) + tééré (livre).",
      },
    ],
  },

  // ---- Leçon 2 : la préposition possessive -u, « de » (unité 3, § 1) ----
  "u3-l2": {
    id: "u3-l2",
    title: "« De » : -u",
    newWords: [
      { wolof: "-u", french: "de, à (préposition)" },
      { wolof: "ubi", french: "ouvrir" },
      { wolof: "xarit", french: "ami(e)" },
      { wolof: "cééb", french: "riz" },
    ],
    steps: [
      {
        type: "lesson_card",
        eyebrow: "Module 3 · Leçon 2",
        title: "« De » : la préposition -u",
        intro: "Pour dire « le livre d'Aminata », on accroche -u au premier nom.",
        blocks: [
          {
            type: "context_examples",
            title: "Exemples du cours",
            examples: [
              { wolof: "Tijan angi jang tééré-u Aminata", french: "Tidiane lit le livre d'Aminata." },
              { wolof: "Mungiy ubi bunt-u taksi bi", french: "Il / elle ouvre la porte de ce taxi." },
              {
                wolof: "Yangi tog cééb-u yapp",
                french: "Tu cuisines du riz à la viande.",
                note: "-u peut vouloir dire « de » ou « à »",
              },
            ],
          },
          {
            type: "rule",
            title: "Attention à l'ordre !",
            text: "Avec un possessif, celui-ci passe tout devant : « la maison de mon ami » se dit « ma maison-d'ami ».",
            tiles: [
              {
                formula: "kër-u sumë xarit",
                meaning: "ordre français : faux",
                tone: "yellow",
              },
              {
                formula: "sumë kër-u xarit",
                meaning: "ordre wolof : juste",
                example: "sa bunt-u kër",
                exampleTranslation: "la porte de ta maison",
                tone: "green",
              },
            ],
          },
        ],
      },
      {
        type: "multiple_choice",
        eyebrow: "« De » : -u",
        question: "Que veut dire cette phrase ?",
        prompt: "Mungiy ubi bunt-u taksi bi",
        choices: [
          "Il ouvre la porte de ce taxi",
          "Il ferme la porte de la maison",
          "Il prend le taxi de son ami",
          "Il attend devant la porte",
        ],
        answerIndex: 0,
        explanation: "bunt-u taksi bi = la porte de ce taxi ; ubi = ouvrir.",
      },
      {
        type: "multiple_choice",
        eyebrow: "L'ordre des mots",
        question: "Comment dit-on « la porte de ta maison » ?",
        prompt: "la porte de ta maison",
        choices: ["sa bunt-u kër", "bunt-u sa kër", "sa kër-u bunt", "kër-u sa bunt"],
        answerIndex: 0,
        explanation: "Le possessif passe devant : sa (ta) + bunt-u (porte de) + kër (maison).",
      },
      {
        type: "build_sentence",
        eyebrow: "« De » : -u",
        question: "Construis la phrase en wolof",
        sourceText: "Tidiane lit le livre d'Aminata.",
        answer: ["Tijan", "angi", "jang", "tééré-u", "Aminata"],
        tiles: ["jang", "Aminata", "Tijan", "tééré-u", "sumë", "angi"],
        explanation: "tééré-u Aminata : le livre d'Aminata.",
      },
      {
        type: "write_translation",
        eyebrow: "Traduction écrite",
        question: "Écris en wolof",
        speaker: { name: "Awa", image: "awa" },
        sourceText: "du riz à la viande",
        acceptedAnswers: ["cééb-u yapp", "céébu yapp"],
        hint: "riz = cééb · viande = yapp · « à / de » = -u",
        explanation: "cééb-u yapp : le riz à la viande, avec -u qui relie les deux noms.",
      },
    ],
  },

  // ---- Leçon 3 : l'action accomplie / l'état (unité 3, § 2) ----
  "u3-l3": {
    id: "u3-l3",
    title: "L'accompli",
    newWords: [
      { wolof: "jeex", french: "finir" },
      { wolof: "jeex-në", french: "c'est fini" },
      { wolof: "yomb-në", french: "c'est bon marché" },
      { wolof: "bari", french: "être abondant" },
    ],
    steps: [
      {
        type: "lesson_card",
        eyebrow: "Module 3 · Leçon 3",
        title: "L'accompli",
        intro: "Pour une action terminée (le passé), on ajoute une terminaison au verbe.",
        blocks: [
          {
            type: "conjugation",
            title: "Verbe + terminaison (avec lekk, manger)",
            rows: [
              { pronoun: "je", pronounFrench: "moi", stem: "lekk-", ending: "naa", french: "j'ai mangé" },
              { pronoun: "tu", pronounFrench: "toi", stem: "lekk-", ending: "ngë", french: "tu as mangé" },
              {
                pronoun: "il, elle",
                pronounFrench: "lui, elle",
                stem: "lekk-",
                ending: "në",
                french: "il / elle a mangé",
              },
              {
                pronoun: "nous",
                pronounFrench: "nous",
                stem: "lekk-",
                ending: "neñu",
                french: "nous avons mangé",
              },
              {
                pronoun: "vous",
                pronounFrench: "vous",
                stem: "lekk-",
                ending: "ngéén",
                french: "vous avez mangé",
              },
              {
                pronoun: "ils, elles",
                pronounFrench: "eux, elles",
                stem: "lekk-",
                ending: "neñu",
                french: "ils / elles ont mangé",
              },
            ],
          },
          {
            type: "rule",
            title: "En wolof, pas d'adjectif !",
            text: "Un état (être joli, être bon marché…) est un verbe : on le conjugue aussi à l'accompli.",
            tiles: [
              { formula: "yomb-në", meaning: "c'est bon marché", tone: "green" },
              {
                formula: "bari-në",
                meaning: "c'est abondant",
                example: "Cééb bi bari-në",
                exampleTranslation: "Ce riz est abondant",
                tone: "yellow",
              },
            ],
          },
        ],
      },
      {
        type: "multiple_choice",
        eyebrow: "L'accompli",
        question: "Que veut dire ce mot ?",
        prompt: "lekk-në",
        choices: ["il / elle a mangé", "j'ai mangé", "il mange", "vous avez mangé"],
        answerIndex: 0,
        explanation: "lekk (manger) + -në (il / elle) = il / elle a mangé.",
      },
      {
        type: "match_pairs",
        eyebrow: "L'accompli",
        question: "Associe chaque personne à sa terminaison",
        instruction: "Touche une personne, puis sa terminaison.",
        pairs: [
          { wolof: "je", french: "accompli", article: "-naa" },
          { wolof: "tu", french: "accompli", article: "-ngë" },
          { wolof: "il, elle", french: "accompli", article: "-në" },
          { wolof: "vous", french: "accompli", article: "-ngéén" },
        ],
        explanation: "je -naa, tu -ngë, il / elle -në, nous et ils -neñu, vous -ngéén.",
      },
      {
        type: "fill_blank",
        eyebrow: "L'état",
        question: "Complète la phrase",
        speaker: { name: "Awa", subtitle: "sert le repas", image: "awa" },
        before: "Cééb bi",
        after: "",
        translation: "Ce riz est abondant",
        choicesLabel: "Choisis la forme",
        choices: ["bari-në", "bari-naa", "bari-ngë", "bari-ngéén"],
        answerIndex: 0,
        hint: "« Ce riz » : c'est la 3e personne (il).",
        explanation: "bari (être abondant) + -në (il) : cééb bi bari-në.",
      },
      {
        type: "write_translation",
        eyebrow: "Traduction écrite",
        question: "Écris en wolof",
        speaker: { name: "Awa", image: "awa" },
        sourceText: "C'est fini.",
        acceptedAnswers: ["jeex-në", "jeexnë"],
        hint: "finir = jeex · il / elle (c'est) = -në",
        explanation: "jeex (finir) + -në : jeex-në, c'est fini.",
      },
    ],
  },

  // ---- Leçon 4 : la négation accomplie (unité 3, § 3) ----
  "u3-l4": {
    id: "u3-l4",
    title: "La négation",
    newWords: [
      { wolof: "lekkul", french: "il / elle n'a pas mangé" },
      { wolof: "liggey", french: "travailler" },
      { wolof: "defu ko", french: "il ne l'a pas fait" },
      { wolof: "piis", french: "tissu" },
    ],
    steps: [
      {
        type: "lesson_card",
        eyebrow: "Module 3 · Leçon 4",
        title: "La négation",
        intro: "Pour dire « je n'ai pas… », on change seulement la terminaison.",
        blocks: [
          {
            type: "conjugation",
            title: "Verbe + terminaison négative (avec dem, partir)",
            rows: [
              {
                pronoun: "je",
                pronounFrench: "moi",
                stem: "dem-",
                ending: "uma",
                french: "je ne suis pas parti",
              },
              {
                pronoun: "tu",
                pronounFrench: "toi",
                stem: "dem-",
                ending: "ulo",
                french: "tu n'es pas parti",
              },
              {
                pronoun: "il, elle",
                pronounFrench: "lui, elle",
                stem: "dem-",
                ending: "ul",
                french: "il / elle n'est pas parti(e)",
              },
              {
                pronoun: "nous",
                pronounFrench: "nous",
                stem: "dem-",
                ending: "uñu",
                french: "nous ne sommes pas partis",
              },
              {
                pronoun: "vous",
                pronounFrench: "vous",
                stem: "dem-",
                ending: "uléén",
                french: "vous n'êtes pas partis",
              },
              {
                pronoun: "ils, elles",
                pronounFrench: "eux, elles",
                stem: "dem-",
                ending: "uñu",
                french: "ils / elles ne sont pas parti(e)s",
              },
            ],
          },
          {
            type: "rule",
            title: "Le « l » qui tombe",
            text: "Quand le verbe est suivi d'un pronom objet, le l de -ul disparaît.",
            tiles: [
              { formula: "deful + ko", meaning: "sans contraction", tone: "yellow" },
              {
                formula: "defu ko",
                meaning: "ce qu'on dit",
                example: "Defu ko",
                exampleTranslation: "Il ne l'a pas fait",
                tone: "green",
              },
            ],
          },
          {
            type: "context_examples",
            title: "Exemples du cours",
            examples: [
              { wolof: "Tey, liggey-ulo", french: "Aujourd'hui, tu n'as pas travaillé." },
              { wolof: "Cééb bi bari-ul", french: "Ce riz n'est pas abondant." },
              { wolof: "Piis yi rafet-uñu", french: "Ces tissus ne sont pas beaux." },
            ],
          },
        ],
      },
      {
        type: "multiple_choice",
        eyebrow: "La négation",
        question: "Que veut dire ce mot ?",
        prompt: "lekkul",
        choices: ["il / elle n'a pas mangé", "il / elle a mangé", "je n'ai pas mangé", "mange !"],
        answerIndex: 0,
        explanation: "lekk + -ul (il / elle, négatif) = il / elle n'a pas mangé.",
      },
      {
        type: "fill_blank",
        eyebrow: "La négation",
        question: "Complète la phrase",
        speaker: { name: "Awa", subtitle: "te taquine", image: "awa" },
        before: "Tey,",
        after: "",
        translation: "Aujourd'hui, tu n'as pas travaillé",
        choicesLabel: "Choisis la forme",
        choices: ["liggey-ulo", "liggey-uma", "liggey-ul", "liggey-ngë"],
        answerIndex: 0,
        hint: "« tu », à la négation : -ulo.",
        explanation: "liggey (travailler) + -ulo (tu, négatif) : tu n'as pas travaillé.",
      },
      {
        type: "multiple_choice",
        eyebrow: "Le « l » qui tombe",
        question: "Que veut dire cette phrase ?",
        prompt: "Defu ko",
        choices: ["Il ne l'a pas fait", "Il l'a fait", "Je ne l'ai pas fait", "Il ne me l'a pas dit"],
        answerIndex: 0,
        explanation: "deful + ko → defu ko : le l tombe devant le pronom objet.",
      },
      {
        type: "build_sentence",
        eyebrow: "La négation",
        question: "Construis la phrase en wolof",
        sourceText: "Ce riz n'est pas abondant.",
        answer: ["Cééb", "bi", "bari-ul"],
        tiles: ["bari-në", "bi", "Cééb", "bari-ul", "yi"],
        explanation: "bari-ul : -ul est la négation de -në (il / elle).",
      },
      {
        type: "write_translation",
        eyebrow: "Traduction écrite",
        question: "Écris en wolof",
        speaker: { name: "Awa", image: "awa" },
        sourceText: "Il n'a pas mangé.",
        acceptedAnswers: ["lekkul", "lekk-ul"],
        hint: "manger = lekk · « il … pas » = -ul",
        explanation: "lekk + -ul = lekkul.",
      },
    ],
  },

  // ---- Leçon 5 : la famille (vocabulaire + Version de l'unité 3) ----
  "u3-l5": {
    id: "u3-l5",
    title: "La famille",
    newWords: [
      { wolof: "baay", french: "père" },
      { wolof: "yaay", french: "mère" },
      { wolof: "rakk", french: "petit frère, petite sœur" },
      { wolof: "jabar", french: "épouse" },
    ],
    steps: [
      {
        type: "lesson_card",
        eyebrow: "Module 3 · Leçon 5",
        title: "La famille",
        intro: "Le vocabulaire de l'unité 3 pour parler de tes proches.",
        blocks: [
          {
            type: "related_words",
            title: "Les parents",
            words: [
              { wolof: "baay", french: "père" },
              { wolof: "yaay, ndey", french: "mère" },
              { wolof: "maam", french: "grand-parent" },
              { wolof: "nijaay", french: "oncle" },
              { wolof: "bajan", french: "tante paternelle" },
              { wolof: "mboq", french: "parent" },
            ],
          },
          {
            type: "related_words",
            title: "Frères, sœurs et couple",
            words: [
              { wolof: "mag", french: "grand frère, grande sœur" },
              { wolof: "rakk", french: "petit frère, petite sœur" },
              { wolof: "jabar", french: "épouse" },
              { wolof: "jëkkër", french: "mari" },
            ],
          },
        ],
      },
      {
        type: "match_pairs",
        eyebrow: "La famille",
        question: "Associe chaque mot à sa traduction",
        instruction: "Touche un mot français, puis le mot wolof.",
        pairs: [
          { wolof: "père", french: "famille", article: "baay" },
          { wolof: "mère", french: "famille", article: "yaay" },
          { wolof: "mari", french: "famille", article: "jëkkër" },
          { wolof: "épouse", french: "famille", article: "jabar" },
        ],
        explanation: "baay = père, yaay = mère, jëkkër = mari, jabar = épouse.",
      },
      {
        type: "multiple_choice",
        eyebrow: "Version du cours",
        question: "Que veut dire cette phrase ?",
        prompt: "Sumë jabar angiy tog cééb-u jën ak sumë jabar-u xarit.",
        choices: [
          "Mon épouse cuisine du riz au poisson avec la femme de mon ami.",
          "Ma mère achète du poisson pour mon ami.",
          "Mon ami mange le riz de ma femme.",
          "Ma femme vend du poisson au marché.",
        ],
        answerIndex: 0,
        explanation: "sumë jabar-u xarit = la femme de mon ami : le possessif passe devant !",
      },
      {
        type: "multiple_choice",
        eyebrow: "Version du cours",
        question: "Que veut dire cette phrase ?",
        prompt: "Maam Jor angiy gungé jëkkëram bë kër-u Job.",
        choices: [
          "Mame Dior accompagne son mari jusqu'à la maison de Diop.",
          "Mame Dior attend son mari chez Diop.",
          "Le mari de Mame Dior part chez Diop.",
          "Diop accompagne Mame Dior chez elle.",
        ],
        answerIndex: 0,
        explanation: "jëkkër + -am = jëkkëram, son mari ; kër-u Job = la maison de Diop.",
      },
      {
        type: "write_translation",
        eyebrow: "Traduction écrite",
        question: "Écris en wolof",
        speaker: { name: "Awa", image: "awa" },
        sourceText: "mon père",
        acceptedAnswers: ["sumë baay"],
        hint: "mon = sumë · père = baay",
        explanation: "sumë baay : le possessif se place devant le nom.",
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Module 4 : l'argent en dërëm (cahier des charges : « nombres en base cinq ; argent en dërëm »)
  // ⚠️ Le module 4 n'est pas encore sur le Parcours : leçon accessible via le menu développeur du Profil.
  // ---------------------------------------------------------------------------
  "u4-derem": {
    id: "u4-derem",
    title: "Au marché : les dërëm",
    newWords: [
      { wolof: "dërëm", french: "pièce de 5 F CFA" },
      { wolof: "fuki dërëm", french: "50 F CFA" },
      { wolof: "téémeri dërëm", french: "500 F CFA" },
      { wolof: "junni dërëm", french: "5 000 F CFA" },
    ],
    steps: [
      {
        type: "explanation",
        eyebrow: "Au marché · La monnaie",
        title: "On compte en dërëm",
        text: "Au marché, les prix se disent souvent en dërëm : 1 dërëm = 5 F CFA. Pour trouver le nombre de dërëm, divise le prix par 5.",
        examples: [
          { wolof: "fuki dërëm", french: "10 dërëm = 50 F CFA" },
          { wolof: "téémeri dërëm", french: "100 dërëm = 500 F CFA" },
        ],
      },
      {
        type: "derem",
        eyebrow: "Au marché · La monnaie",
        question: "Comment dit-on ce prix en wolof ?",
        image: "coin500",
        priceCfa: 500,
        choices: [
          { wolof: "téémeri dërëm", derem: 100 },
          { wolof: "fuki dërëm", derem: 10 },
          { wolof: "junni dërëm", derem: 1000 },
          { wolof: "ñaar fuki dërëm", derem: 20 },
        ],
        explanation: "500 F ÷ 5 = 100 dërëm, soit téémeri dërëm.",
      },
    ],
  },
};
