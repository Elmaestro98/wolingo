import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps, ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import { Colors } from "@/constants/theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

type ChoiceCardProps = {
  icon: IconName;
  title: string;
  description: string;
  /** Cette carte est-elle celle choisie ? (décidé par l'écran, pas par la carte) */
  selected: boolean;
  onPress: () => void;
  /** Petit badge jaune à côté du titre (ex. « Recommandé ») */
  badge?: string;
  /** Ligne en gras entre le titre et la description (ex. « 10 min / jour ») */
  highlight?: string;
  /** Contenu libre affiché sous la description (ex. une étiquette) */
  footer?: ReactNode;
};

/** Carte de choix unique (écrans 02 et 04). Verte si sélectionnée, blanche sinon. */
export function ChoiceCard({
  icon,
  title,
  description,
  selected,
  onPress,
  badge,
  highlight,
  footer,
}: ChoiceCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      // border-b-[6px] = bordure de 2px + "ombre" 3D de 4px en bas, comme le bouton
      className={`min-h-[96px] flex-row items-center gap-3.5 rounded-[18px] border-2 border-b-[6px] p-4 ${
        selected ? "border-green bg-green-light" : "border-sand bg-white"
      }`}
    >
      {/* Icône dans un carré arrondi */}
      <View
        className={`h-12 w-12 items-center justify-center rounded-[14px] ${
          selected ? "bg-green" : "bg-[#F3EEE5]"
        }`}
      >
        <Ionicons name={icon} size={24} color={selected ? Colors.white : "#3D3730"} />
      </View>

      {/* Textes : flex-1 = prend toute la place entre l'icône et le rond */}
      <View className="flex-1 gap-1">
        <View className="flex-row flex-wrap items-center gap-2">
          <Text className="font-title text-[19px] text-ink">{title}</Text>
          {badge && (
            <View className="rounded-full bg-yellow px-2 py-0.5">
              <Text className="font-body-black text-[10.5px] uppercase tracking-[0.6px] text-[#3A2A00]">
                {badge}
              </Text>
            </View>
          )}
        </View>
        {highlight && (
          <Text className={`font-body-black text-sm ${selected ? "text-green" : "text-[#3D3730]"}`}>
            {highlight}
          </Text>
        )}
        <Text className="font-body text-[13.5px] leading-[18px] text-muted">{description}</Text>
        {/* L'emplacement libre : l'écran y met ce qu'il veut */}
        {footer && <View className="mt-1 flex-row">{footer}</View>}
      </View>

      {/* Rond à droite : coché (vert + ✓) ou vide */}
      <View
        className={`h-[26px] w-[26px] items-center justify-center rounded-full ${
          selected ? "bg-green" : "border-2 border-[#CFC6B8] bg-white"
        }`}
      >
        {selected && <Ionicons name="checkmark" size={16} color={Colors.white} />}
      </View>
    </Pressable>
  );
}
