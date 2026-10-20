import { router } from "expo-router";
import { Pressable, Switch, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { LESSONS } from "@/content/lessons";
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

  if (!__DEV__) return null;

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
