import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

type LessonHeaderProps = {
  /** Avancement dans la leçon, entre 0 et 1 */
  progress: number;
  /** Vies restantes ; null = illimitées (Premium) */
  hearts: number | null;
  onClose: () => void;
};

/** En-tête commun à toutes les étapes d'une leçon : ✕, barre de progression, vies. */
export function LessonHeader({ progress, hearts, onClose }: LessonHeaderProps) {
  return (
    <View className="flex-row items-center gap-3 px-5 pb-2.5 pt-3.5">
      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Quitter la leçon"
        className="h-11 w-11 items-center justify-center rounded-full active:bg-sand"
      >
        <Ionicons name="close" size={26} color="#3D3730" />
      </Pressable>

      {/* Barre de progression : le rail gris + la partie verte de largeur calculée */}
      <View
        accessibilityRole="progressbar"
        accessibilityLabel="Progression de la leçon"
        accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
        className="h-3 flex-1 overflow-hidden rounded-full bg-disabled"
      >
        <View className="h-full rounded-full bg-green" style={{ width: `${progress * 100}%` }} />
      </View>

      <View
        accessible
        accessibilityLabel={hearts === null ? "Vies illimitées" : `${hearts} vies`}
        className="h-10 flex-row items-center gap-1 px-2.5"
      >
        <Ionicons name="heart" size={20} color="#E5484D" />
        <Text className="font-body-black text-base text-[#B42318]">{hearts === null ? "∞" : hearts}</Text>
      </View>
    </View>
  );
}
