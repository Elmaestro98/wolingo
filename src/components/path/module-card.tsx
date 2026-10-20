import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

import type { Module } from "@/content/modules";
import { Colors } from "@/constants/theme";

type ModuleCardProps = {
  module: Module;
  /** Nombre de leçons terminées dans ce module */
  completedLessons: number;
  /** Nombre total de leçons du module */
  totalLessons: number;
  onOpenGuide: () => void;
};

/** Grande carte verte en haut du Parcours : le module en cours et sa progression. */
export function ModuleCard({ module, completedLessons, totalLessons, onOpenGuide }: ModuleCardProps) {
  // Pourcentage de remplissage de la barre (0 à 100). Évite la division par zéro.
  const percent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <View className="overflow-hidden rounded-3xl border-b-[6px] border-green-shadow bg-green p-5">
      {/* Décor : deux losanges en filigrane en haut à droite */}
      <View className="absolute -right-6 -top-8 h-28 w-28 rotate-45 rounded-2xl border-2 border-white opacity-[0.12]" />
      <View className="absolute right-10 top-10 h-20 w-20 rotate-45 rounded-xl border-2 border-white opacity-[0.12]" />

      <View className="flex-row items-center justify-between">
        <View className="rounded-full bg-green-light px-2.5 py-1">
          <Text className="font-body-black text-[11.5px] uppercase tracking-[0.7px] text-green">
            Unité {module.number} · Niveau {module.level}
          </Text>
        </View>

        <Pressable
          onPress={onOpenGuide}
          accessibilityRole="button"
          className="h-9 flex-row items-center gap-1.5 rounded-full bg-white/15 px-3 active:bg-white/25"
        >
          <Ionicons name="book-outline" size={16} color={Colors.white} />
          <Text className="font-body-black text-[13px] text-white">Guide</Text>
        </Pressable>
      </View>

      <Text className="mb-1 mt-3.5 font-title text-[26px] leading-[29px] text-white">
        Module {module.number} · {module.title}
      </Text>
      <Text className="font-body text-[15px] leading-[21px] text-[#D5EADD]">
        {module.subtitle} <Text className="font-body-black text-[#F7D867]">{module.example}</Text>
      </Text>

      {/* Barre de progression */}
      <View className="mt-4 flex-row items-center gap-2.5">
        <View className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/20">
          {/* Largeur CALCULÉE pendant que l'app tourne → prop `style`, pas une classe Tailwind */}
          <View className="h-full rounded-full bg-yellow" style={{ width: `${percent}%` }} />
        </View>
        <Text className="font-body-black text-[13px] text-white">
          {completedLessons} / {totalLessons} leçons
        </Text>
      </View>
    </View>
  );
}
