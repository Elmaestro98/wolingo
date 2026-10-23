/** Les statistiques dont les badges ont besoin. */
export type LearnerStats = {
  totalXp: number;
  /** Série affichée aujourd'hui (0 si cassée) */
  streakDays: number;
  completedLessonCount: number;
  learnedWordCount: number;
  /** Ids des modules validés (Grand quiz réussi) */
  completedModuleIds: string[];
};

export type BadgeId = "first_step" | "first_taxi" | "streak_3" | "xp_100" | "words_25";

type BadgeDefinition = {
  id: BadgeId;
  title: string;
  description: string;
  /** La règle : à partir des statistiques, le badge est-il gagné ? */
  isUnlocked: (stats: LearnerStats) => boolean;
};

/**
 * Tous les badges de l'app. Pour en ajouter un : une ligne ici (+ son icône dans l'écran Profil).
 * « Premier taxi » vient du cahier des charges (unité 1 terminée).
 */
const BADGES: BadgeDefinition[] = [
  {
    id: "first_step",
    title: "Premier pas",
    description: "Termine ta première leçon",
    isUnlocked: (stats) => stats.completedLessonCount >= 1,
  },
  {
    id: "first_taxi",
    title: "Premier taxi",
    description: "Valide le module 1",
    isUnlocked: (stats) => stats.completedModuleIds.includes("u1"),
  },
  {
    id: "streak_3",
    title: "Ndank-ndank",
    description: "3 jours d'affilée",
    isUnlocked: (stats) => stats.streakDays >= 3,
  },
  {
    id: "xp_100",
    title: "100 XP",
    description: "Gagne 100 XP",
    isUnlocked: (stats) => stats.totalXp >= 100,
  },
  {
    id: "words_25",
    title: "Bibliothèque",
    description: "Apprends 25 mots",
    isUnlocked: (stats) => stats.learnedWordCount >= 25,
  },
];

/** Un badge, avec son état pour cet apprenant. */
export type BadgeState = {
  id: BadgeId;
  title: string;
  description: string;
  unlocked: boolean;
};

/** Calcule l'état de chaque badge. Fonction pure : rien n'est sauvegardé, tout se déduit des statistiques. */
export function getBadgeStates(stats: LearnerStats): BadgeState[] {
  return BADGES.map((badge) => ({
    id: badge.id,
    title: badge.title,
    description: badge.description,
    unlocked: badge.isUnlocked(stats),
  }));
}
