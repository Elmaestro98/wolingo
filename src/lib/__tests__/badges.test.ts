import { getBadgeStates, type LearnerStats } from "@/lib/badges";

const BEGINNER: LearnerStats = {
  totalXp: 0,
  streakDays: 0,
  completedLessonCount: 0,
  learnedWordCount: 0,
  completedModuleIds: [],
};

/** Raccourci : les ids des badges gagnés */
function unlockedIds(stats: LearnerStats) {
  return getBadgeStates(stats)
    .filter((badge) => badge.unlocked)
    .map((badge) => badge.id);
}

describe("badges", () => {
  it("aucun badge pour un tout nouvel apprenant", () => {
    expect(unlockedIds(BEGINNER)).toEqual([]);
  });

  it("« Premier pas » après la première leçon", () => {
    expect(unlockedIds({ ...BEGINNER, completedLessonCount: 1 })).toEqual(["first_step"]);
  });

  it("« Premier taxi » quand le module 1 est validé (cahier des charges)", () => {
    expect(unlockedIds({ ...BEGINNER, completedModuleIds: ["u1"] })).toContain("first_taxi");
  });

  it("les seuils sont inclus (3 jours, 100 XP, 25 mots)", () => {
    const stats = { ...BEGINNER, streakDays: 3, totalXp: 100, learnedWordCount: 25 };
    expect(unlockedIds(stats)).toEqual(["streak_3", "xp_100", "words_25"]);
  });
});
