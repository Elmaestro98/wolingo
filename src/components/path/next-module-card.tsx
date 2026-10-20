import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";

import type { Module } from "@/content/modules";

type NextModuleCardProps = {
  module: Module;
  /** Numéro du module à terminer pour débloquer celui-ci */
  previousModuleNumber: number;
};

/** Carte en pointillés en bas du chemin : le module suivant, encore verrouillé. */
export function NextModuleCard({ module, previousModuleNumber }: NextModuleCardProps) {
  return (
    <View
      accessible
      accessibilityLabel={`Module ${module.number}, ${module.title}, verrouillé`}
      className="flex-row items-center gap-3.5 rounded-[20px] border-2 border-dashed border-[#DCD2C2] px-4 py-3.5"
    >
      <View className="h-12 w-12 items-center justify-center rounded-[14px] bg-sand">
        <Ionicons name="lock-closed" size={22} color="#857A6B" />
      </View>

      <View className="flex-1">
        <Text className="font-body-black text-[11.5px] uppercase tracking-[1.1px] text-muted">
          Module {module.number}
        </Text>
        <Text className="font-title text-lg text-ink">{module.title}</Text>
        <Text className="font-body text-[12.5px] text-muted">
          Termine le module {previousModuleNumber} pour le débloquer
        </Text>
      </View>
    </View>
  );
}
