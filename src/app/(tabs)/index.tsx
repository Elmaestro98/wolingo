import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DailyStats } from "@/components/path/daily-stats";
import { LessonPath } from "@/components/path/lesson-path";
import { ModuleCard } from "@/components/path/module-card";
import { NextModuleCard } from "@/components/path/next-module-card";
import { StatPill } from "@/components/path/stat-pill";
import { MODULES } from "@/content/modules";
import { getDisplayedStreak, toDateKey } from "@/lib/dates";
import { getCurrentModule, getPathItemStates, isModuleCompleted } from "@/lib/path";
import { useNow } from "@/hooks/use-now";
import { computeHearts } from "@/lib/hearts";
import { useProgressStore } from "@/stores/progress-store";
import { useSettingsStore } from "@/stores/settings-store";

/** Écran 05 de la maquette : le Parcours (onglet principal). */
export default function PathScreen() {
  // Le vrai objectif choisi pendant l'onboarding (la maquette affichait toujours 10)
  const dailyGoalMinutes = useSettingsStore((state) => state.dailyGoalMinutes);

  // La vraie progression, lue dans le magasin (l'écran se redessine dès qu'elle change)
  const completedLessons = useProgressStore((state) => state.completedLessons);
  const totalXp = useProgressStore((state) => state.totalXp);
  const streakDays = useProgressStore((state) => state.streakDays);
  const lastActiveDateKey = useProgressStore((state) => state.lastActiveDateKey);
  const minutesToday = useProgressStore((state) => state.minutesToday);
  const todayDateKey = useProgressStore((state) => state.todayDateKey);
  const isPremium = useSettingsStore((state) => state.isPremium);
  const savedHearts = useProgressStore((state) => state.hearts);
  const heartsRefillStartedAt = useProgressStore((state) => state.heartsRefillStartedAt);

  // L'heure actuelle, mise à jour toutes les 30 s : les vies regagnées apparaissent toutes seules
  const nowMs = useNow(30_000);
  const currentHearts = computeHearts(
    { hearts: savedHearts, refillStartedAt: heartsRefillStartedAt },
    nowMs,
  ).hearts;

  // Valeurs à afficher AUJOURD'HUI (une série cassée s'affiche 0 ; les minutes d'hier ne comptent pas)
  const now = new Date(nowMs);
  const displayedStreak = getDisplayedStreak(streakDays, lastActiveDateKey, now);
  const displayedMinutes = todayDateKey === toDateKey(now) ? minutesToday : 0;

  // Le module en cours (le premier non validé qui a du contenu) et celui juste après
  const currentModule = getCurrentModule(MODULES, completedLessons);
  const nextModule = MODULES[MODULES.indexOf(currentModule) + 1]; // undefined s'il n'y en a pas

  // Calculs à partir des données : seules les étapes de type « lesson » comptent
  const lessons = currentModule.items.filter((item) => item.kind === "lesson");
  const completedCount = lessons.filter((lesson) => lesson.id in completedLessons).length;

  // État de chaque étape du chemin (terminée / en cours / verrouillée)
  const pathStates = getPathItemStates(currentModule.items, completedLessons);

  // Le module est validé quand son Grand quiz est réussi
  const isCurrentModuleCompleted = isModuleCompleted(currentModule, completedLessons);

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
              value={displayedStreak}
              accessibilityLabel={`Série de ${displayedStreak} jours`}
            />
            <StatPill
              icon="heart"
              iconColor="#E5484D"
              value={isPremium ? "∞" : currentHearts}
              accessibilityLabel={isPremium ? "Vies illimitées" : `${currentHearts} vies`}
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

          <DailyStats totalXp={totalXp} minutesToday={displayedMinutes} dailyGoalMinutes={dailyGoalMinutes} />
        </View>

        {/* Le chemin prend toute la largeur de l'écran (pas de marge) pour que le zigzag soit centré */}
        <View className="mt-10">
          <LessonPath states={pathStates} onOpenLesson={(lessonId) => router.push(`/lesson/${lessonId}`)} />
        </View>

        {/* Le module suivant, s'il existe ( && : rien n'est affiché sinon ) */}
        {nextModule && (
          <View className="mt-4 px-4">
            <NextModuleCard
              module={nextModule}
              previousModuleNumber={currentModule.number}
              isUnlocked={isCurrentModuleCompleted}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
