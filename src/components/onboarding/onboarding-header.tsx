import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { Colors } from "@/constants/theme";

type OnboardingHeaderProps = {
  /** Étape actuelle (1, 2 ou 3) */
  step: number;
  /** Nombre total d'étapes */
  totalSteps?: number;
};

/** En-tête des écrans 02 à 04 : bouton retour + barre de progression en segments. */
export function OnboardingHeader({ step, totalSteps = 3 }: OnboardingHeaderProps) {
  // Fabrique la liste [1, 2, 3] pour dessiner un segment par étape
  const segments = Array.from({ length: totalSteps }, (_, index) => index + 1);

  return (
    <View className="flex-row items-center gap-3.5">
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Retour"
        className="h-11 w-11 items-center justify-center rounded-full bg-white active:opacity-70"
      >
        <Ionicons name="arrow-back" size={20} color={Colors.ink} />
      </Pressable>

      {/* Segments : vert si l'étape est atteinte, gris sinon */}
      <View className="flex-1 flex-row gap-1.5">
        {segments.map((segment) => (
          <View
            key={segment}
            className={`h-2 flex-1 rounded-full ${segment <= step ? "bg-green" : "bg-disabled"}`}
          />
        ))}
      </View>

      <Text className="font-body-black text-[13px] text-muted">
        {step} / {totalSteps}
      </Text>
    </View>
  );
}
