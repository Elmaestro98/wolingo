import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import { Text, View } from "react-native";

type StatPillProps = {
  icon: ComponentProps<typeof Ionicons>["name"];
  iconColor: string;
  /** Un nombre, ou un texte (ex. « ∞ » pour des vies illimitées) */
  value: number | string;
  /** Petit texte gris optionnel après le nombre (ex. « 04:12 » avant la prochaine vie) */
  detail?: string;
  /** Texte lu par VoiceOver (ex. « Série de 5 jours ») */
  accessibilityLabel: string;
};

/** Pastille blanche « icône + nombre » de l'en-tête du Parcours (série 🔥, vies ❤️). */
export function StatPill({ icon, iconColor, value, detail, accessibilityLabel }: StatPillProps) {
  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      className="h-10 flex-row items-center gap-1.5 rounded-full bg-white px-3"
    >
      <Ionicons name={icon} size={18} color={iconColor} />
      <Text className="font-body-black text-[15px] text-ink">{value}</Text>
      {/* Le détail n'est affiché que s'il existe ( && ) */}
      {detail && <Text className="font-body-bold text-[13px] text-muted">{detail}</Text>}
    </View>
  );
}
