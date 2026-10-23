import { LESSONS } from "@/content/lessons";
import { MODULES } from "@/content/modules";
import { useNow } from "@/hooks/use-now";
import type { LearnerStats } from "@/lib/badges";
import { getDisplayedStreak } from "@/lib/dates";
import { isModuleCompleted } from "@/lib/path";
import { collectVocabulary } from "@/lib/vocabulary";
import { useProgressStore } from "@/stores/progress-store";

// Ne dépendent que du contenu : calculés une seule fois
const ALL_WORDS = collectVocabulary(MODULES, LESSONS);
const ALL_LESSON_IDS = MODULES.flatMap((moduleData) =>
  moduleData.items.filter((item) => item.kind === "lesson").map((item) => item.id),
);

/**
 * Hook personnalisé : rassemble les statistiques de l'apprenant à partir du magasin de progression
 * et du contenu. L'écran qui l'utilise se redessine dès que la progression change.
 */
export function useLearnerStats(): LearnerStats & { totalLessonCount: number; totalWordCount: number } {
  const completedLessons = useProgressStore((state) => state.completedLessons);
  const totalXp = useProgressStore((state) => state.totalXp);
  const streakDays = useProgressStore((state) => state.streakDays);
  const lastActiveDateKey = useProgressStore((state) => state.lastActiveDateKey);

  // L'heure en mémoire (jamais Date.now() pendant l'affichage) : la série cassée s'affiche 0
  const now = useNow(60_000);

  return {
    totalXp,
    streakDays: getDisplayedStreak(streakDays, lastActiveDateKey, new Date(now)),
    completedLessonCount: ALL_LESSON_IDS.filter((id) => id in completedLessons).length,
    totalLessonCount: ALL_LESSON_IDS.length,
    learnedWordCount: ALL_WORDS.filter((entry) => entry.lessonId in completedLessons).length,
    totalWordCount: ALL_WORDS.length,
    completedModuleIds: MODULES.filter((moduleData) => isModuleCompleted(moduleData, completedLessons)).map(
      (moduleData) => moduleData.id,
    ),
  };
}
