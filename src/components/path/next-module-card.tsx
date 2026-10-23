import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import type { Module } from "@/content/modules";

type NextModuleCardProps = {
  module: Module;
  /** Numéro du module à terminer pour débloquer celui-ci */
  previousModuleNumber: number;
  /** Le module précédent est-il validé (Grand quiz réussi) ? */
  isUnlocked: boolean;
};

/** Carte en bas du chemin : le module suivant, verrouillé (pointillés) ou débloqué (vert). */
export function NextModuleCard({ module, previousModuleNumber, isUnlocked }: NextModuleCardProps) {
  return (
    <View
      accessible
      accessibilityLabel={`Module ${module.number}, ${module.title}, ${isUnlocked ? "débloqué" : "verrouillé"}`}
      className={`flex-row items-center gap-3.5 rounded-[20px] border-2 px-4 py-3.5 ${
        isUnlocked ? "border-green bg-green-light" : "border-dashed border-[#DCD2C2]"
      }`}
    >
      <View
        className={`h-12 w-12 items-center justify-center rounded-[14px] ${isUnlocked ? "bg-green" : "bg-sand"}`}
      >
        <Ionicons
          name={isUnlocked ? "lock-open" : "lock-closed"}
          size={22}
          color={isUnlocked ? Colors.white : "#857A6B"}
        />
      </View>

      <View className="flex-1">
        <Text className="font-body-black text-[11.5px] uppercase tracking-[1.1px] text-muted">
          Module {module.number}
        </Text>
        <Text className="font-title text-lg text-ink">{module.title}</Text>
        <Text className={`font-body text-[12.5px] ${isUnlocked ? "text-green" : "text-muted"}`}>
          {isUnlocked
            ? "Débloqué ! Les leçons arrivent bientôt."
            : `Termine le module ${previousModuleNumber} pour le débloquer`}
        </Text>
      </View>
    </View>
  );
}
