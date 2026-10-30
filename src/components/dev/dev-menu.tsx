import { router } from "expo-router";
import { Alert, Pressable, Switch, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { LESSONS } from "@/content/lessons";
import { MODULES } from "@/content/modules";
import { toDateKey } from "@/lib/dates";
import { sendTestReminder } from "@/services/notifications";
import { useProgressStore } from "@/stores/progress-store";
import { useSettingsStore } from "@/stores/settings-store";

/**
 * Menu développeur : ouvrir n'importe quelle leçon, activer le Premium pour tester…
 * __DEV__ vaut true pendant le développement (npx expo start) et false dans l'app publiée :
 * ce menu n'apparaîtra donc JAMAIS chez les utilisateurs.
 */
export function DevMenu() {
  // Les hooks AVANT le premier return (règle des hooks)
  const isPremium = useSettingsStore((state) => state.isPremium);
  const setPremium = useSettingsStore((state) => state.setPremium);
  const completeLesson = useProgressStore((state) => state.completeLesson);
  const resetProgress = useProgressStore((state) => state.resetProgress);
  const dailyGoalMinutes = useSettingsStore((state) => state.dailyGoalMinutes);

  if (!__DEV__) return null;

  /** Raccourci de test : envoie le rappel dans 5 secondes (pense à quitter l'app pour bien le voir). */
  async function handleTestReminder() {
    const sent = await sendTestReminder(dailyGoalMinutes);
    Alert.alert(
      sent ? "Rappel dans 5 secondes" : "Notifications refusées",
      sent
        ? "Retourne sur l'écran d'accueil de l'iPhone pour le voir arriver."
        : "Autorise les notifications pour Expo Go dans les Réglages de l'iPhone.",
    );
  }

  /** Raccourci de test : marque toutes les leçons du module 1 comme terminées (★★★) → le quiz s'ouvre. */
  function completeModuleOneLessons() {
    MODULES[0].items
      .filter((item) => item.kind === "lesson")
      .forEach((lesson) => completeLesson(lesson.id, { stars: 3, xp: 0, minutes: 0 }));
  }

  /** Raccourci de test : efface toute la progression (leçons, XP, série, vies, révisions). Les réglages sont gardés. */
  function confirmResetProgress() {
    // On demande confirmation : une fois effacée, la progression ne revient pas
    Alert.alert("Remettre la progression à zéro ?", "Leçons, XP, série, vies et révisions seront effacées.", [
      { text: "Annuler", style: "cancel" },
      { text: "Tout effacer", style: "destructive", onPress: resetProgress },
    ]);
  }

  /** Raccourci de test : toutes les révisions programmées deviennent « à revoir aujourd'hui ». */
  function makeReviewsDueNow() {
    const todayKey = toDateKey(new Date());
    // setState en dehors d'un composant : modifie le magasin directement (réservé aux outils de test)
    useProgressStore.setState((state) => ({
      reviewItems: Object.fromEntries(
        Object.entries(state.reviewItems).map(([ref, item]) => [ref, { ...item, dueDateKey: todayKey }]),
      ),
    }));
  }

  // Object.values : transforme le dictionnaire { "u1-l3": leçon, … } en liste de leçons
  const lessons = Object.values(LESSONS);

  return (
    <View className="w-full gap-3 rounded-2xl border-2 border-dashed border-[#DCD2C2] p-3">
      <Text className="font-body-black text-xs uppercase tracking-[1px] text-muted">🛠 Développeur</Text>

      {/* Interrupteur Premium (en attendant le vrai paiement) */}
      <View className="flex-row items-center justify-between">
        <Text className="font-body-bold text-sm text-ink">Premium (vies illimitées)</Text>
        <Switch
          value={isPremium}
          onValueChange={setPremium}
          trackColor={{ true: Colors.green, false: "#CFC6B8" }}
          thumbColor={Colors.white}
          ios_backgroundColor="#CFC6B8"
        />
      </View>

      <Pressable
        onPress={completeModuleOneLessons}
        className="rounded-full bg-white px-3 py-2 active:bg-sand"
      >
        <Text className="text-center font-body-bold text-[13px] text-ink">
          ✅ Boucler les leçons du module 1 (pour tester le quiz)
        </Text>
      </Pressable>

      <Pressable onPress={makeReviewsDueNow} className="rounded-full bg-white px-3 py-2 active:bg-sand">
        <Text className="text-center font-body-bold text-[13px] text-ink">
          ⏩ Révisions dues maintenant (pour tester la révision)
        </Text>
      </Pressable>

      <Pressable onPress={handleTestReminder} className="rounded-full bg-white px-3 py-2 active:bg-sand">
        <Text className="text-center font-body-bold text-[13px] text-ink">
          🔔 Recevoir le rappel dans 5 secondes
        </Text>
      </Pressable>

      <Pressable onPress={confirmResetProgress} className="rounded-full bg-white px-3 py-2 active:bg-sand">
        <Text className="text-center font-body-bold text-[13px] text-red">
          🗑 Remettre la progression à zéro
        </Text>
      </Pressable>

      {/* Ouvrir une leçon */}
      <View className="flex-row flex-wrap gap-2">
        {lessons.map((lesson) => (
          <Pressable
            key={lesson.id}
            onPress={() => router.push(`/lesson/${lesson.id}`)}
            className="rounded-full bg-white px-3 py-1.5 active:bg-sand"
          >
            <Text className="font-body-bold text-[13px] text-ink">
              {lesson.title} <Text className="text-muted">({lesson.steps.length})</Text>
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
