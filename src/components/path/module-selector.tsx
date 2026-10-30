import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import type { Module } from "@/content/modules";
import type { ModuleStatus } from "@/lib/path";

type ModuleSelectorProps = {
  modules: { module: Module; status: ModuleStatus }[];
  /** Le module affiché en dessous */
  selectedModuleId: string;
  onSelect: (moduleId: string) => void;
};

// Apparence de chaque état (classes écrites EN ENTIER pour Tailwind)
const STATUS_LOOKS = {
  completed: { tile: "bg-green", number: "text-white" },
  current: { tile: "bg-yellow", number: "text-[#3A2A00]" },
  locked: { tile: "bg-sand", number: "text-[#857A6B]" },
} as const;

const STATUS_LABELS: Record<ModuleStatus, string> = {
  completed: "validé",
  current: "en cours",
  locked: "verrouillé",
};

/** Rangée de modules qu'on fait défiler horizontalement, en haut du Parcours. */
export function ModuleSelector({ modules, selectedModuleId, onSelect }: ModuleSelectorProps) {
  return (
    // horizontal : on fait défiler de gauche à droite (10 modules ne tiennent pas sur la largeur)
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2.5 px-4 py-1"
    >
      {modules.map(({ module, status }) => {
        const look = STATUS_LOOKS[status];
        const isSelected = module.id === selectedModuleId;
        const isLocked = status === "locked";

        return (
          <Pressable
            key={module.id}
            onPress={() => onSelect(module.id)}
            // Un module verrouillé ne s'ouvre pas : ta règle « on boucle un module avant le suivant »
            disabled={isLocked}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected, disabled: isLocked }}
            accessibilityLabel={`Module ${module.number}, ${module.title}, ${STATUS_LABELS[status]}`}
            // Contour foncé autour du module affiché (border de même taille partout, pour ne rien décaler)
            className={`items-center gap-1 rounded-[20px] border-2 p-1 ${isSelected ? "border-ink" : "border-transparent"}`}
          >
            <View className={`h-14 w-14 items-center justify-center rounded-2xl ${look.tile}`}>
              <Text className={`font-title text-2xl ${look.number}`}>{module.number}</Text>
              {/* Petit badge dans le coin : ✓ validé, 🔒 verrouillé */}
              {status !== "current" && (
                <View className="absolute -bottom-1 -right-1 h-5 w-5 items-center justify-center rounded-full bg-white">
                  <Ionicons
                    name={status === "completed" ? "checkmark-circle" : "lock-closed"}
                    size={status === "completed" ? 18 : 11}
                    color={status === "completed" ? Colors.green : "#857A6B"}
                  />
                </View>
              )}
            </View>
            <Text className={`font-body-black text-[10.5px] ${isLocked ? "text-[#857A6B]" : "text-ink"}`}>
              Module {module.number}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
