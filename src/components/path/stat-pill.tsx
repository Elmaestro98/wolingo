import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import { Text, View } from "react-native";

type StatPillProps = {
  icon: ComponentProps<typeof Ionicons>["name"];
  iconColor: string;
  /** Un nombre, ou un texte (ex. « ∞ » pour des vies illimitées) */
  value: number | string;
  /** Texte lu par VoiceOver (ex. « Série de 5 jours ») */
  accessibilityLabel: string;
};

/** Pastille blanche « icône + nombre » de l'en-tête du Parcours (série 🔥, vies ❤️). */
export function StatPill({ icon, iconColor, value, accessibilityLabel }: StatPillProps) {
  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      className="h-10 flex-row items-center gap-1.5 rounded-full bg-white px-3"
    >
      <Ionicons name={icon} size={18} color={iconColor} />
      <Text className="font-body-black text-[15px] text-ink">{value}</Text>
    </View>
  );
}
