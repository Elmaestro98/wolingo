import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DailyStats } from "@/components/path/daily-stats";
import { LessonPath } from "@/components/path/lesson-path";
import { ModuleCard } from "@/components/path/module-card";
import { NextModuleCard } from "@/components/path/next-module-card";
import { StatPill } from "@/components/path/stat-pill";
import { DEMO_PROGRESS } from "@/content/demo-progress";
import { MODULES } from "@/content/modules";
import { getPathItemStates } from "@/lib/path";
import { useSettingsStore } from "@/stores/settings-store";

/** Écran 05 de la maquette : le Parcours (onglet principal). */
export default function PathScreen() {
  // Le vrai objectif choisi pendant l'onboarding (la maquette affichait toujours 10)
  const dailyGoalMinutes = useSettingsStore((state) => state.dailyGoalMinutes);

  // Le module en cours (pour l'instant : toujours le premier) et celui d'après
  const currentModule = MODULES[0];
  const nextModule = MODULES[1]; // undefined s'il n'y a pas de module suivant

  // Calculs à partir des données : seules les étapes de type « lesson » comptent
  const lessons = currentModule.items.filter((item) => item.kind === "lesson");
  const completedCount = lessons.filter((lesson) => lesson.id in DEMO_PROGRESS.completedLessons).length;

  // État de chaque étape du chemin (terminée / en cours / verrouillée)
  const pathStates = getPathItemStates(currentModule.items, DEMO_PROGRESS.completedLessons);

  return (
    // edges={["top"]} : on protège seulement le haut (encoche) ; le bas est géré par la barre d'onglets
    <SafeAreaView edges={["top"]} className="flex-1 bg-cream">
      {/* ScrollView : tout son contenu peut défiler verticalement */}
      <ScrollView contentContainerClassName="pb-8" showsVerticalScrollIndicator={false}>
        {/* En-tête : titre à gauche, pastilles à droite */}
        <View className="flex-row items-center justify-between px-6 pb-2.5 pt-3.5">
          <View>
            <Text className="font-body-black text-[11.5px] uppercase tracking-[1.6px] text-yellow-text">
              Wolingo
            </Text>
            <Text className="font-title text-[26px] leading-[29px] text-ink">Parcours</Text>
          </View>
          <View className="flex-row gap-2">
            <StatPill
              icon="flame"
              iconColor="#F59F0B"
              value={DEMO_PROGRESS.streakDays}
              accessibilityLabel={`Série de ${DEMO_PROGRESS.streakDays} jours`}
            />
            <StatPill
              icon="heart"
              iconColor="#E5484D"
              value={DEMO_PROGRESS.hearts}
              accessibilityLabel={`${DEMO_PROGRESS.hearts} vies`}
            />
          </View>
        </View>

        <View className="mt-1.5 gap-[18px] px-4">
          <ModuleCard
            module={currentModule}
            completedLessons={completedCount}
            totalLessons={lessons.length}
            onOpenGuide={() => {
              // Plus tard : ouvrir la fiche de grammaire du module (écran 07)
            }}
          />

          <DailyStats
            totalXp={DEMO_PROGRESS.totalXp}
            minutesToday={DEMO_PROGRESS.minutesToday}
            dailyGoalMinutes={dailyGoalMinutes}
          />

        </View>

        {/* Le chemin prend toute la largeur de l'écran (pas de marge) pour que le zigzag soit centré */}
        <View className="mt-10">
          <LessonPath states={pathStates} onOpenLesson={(lessonId) => router.push(`/lesson/${lessonId}`)} />
        </View>

        {/* Le module suivant, s'il existe ( && : rien n'est affiché sinon ) */}
        {nextModule && (
          <View className="mt-4 px-4">
            <NextModuleCard module={nextModule} previousModuleNumber={currentModule.number} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
