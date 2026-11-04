import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type LessonHeaderProps = {
  /** Avancement dans la leçon, entre 0 et 1 */
  progress: number;
  /** Vies restantes ; null = illimitées (Premium) */
  hearts: number | null;
  onClose: () => void;
};

/** En-tête commun à toutes les étapes d'une leçon : ✕, barre de progression, vies. */
export function LessonHeader({ progress, hearts, onClose }: LessonHeaderProps) {
  // La largeur de la barre verte, animée (entre 0 et 1)
  const animatedProgress = useSharedValue(progress);
  // La taille du cœur : il « sursaute » quand le nombre de vies change
  const heartScale = useSharedValue(1);

  // Quand la progression change, la barre GLISSE jusqu'à sa nouvelle largeur (au lieu de sauter)
  useEffect(() => {
    animatedProgress.set(withSpring(progress, { damping: 18, stiffness: 120 }));
  }, [progress, animatedProgress]);

  // Quand une vie est perdue (ou regagnée) : le cœur grossit vite, puis revient avec un ressort
  useEffect(() => {
    heartScale.set(withSequence(withTiming(1.4, { duration: 120 }), withSpring(1, { damping: 8 })));
  }, [hearts, heartScale]);

  // Math.min / Math.max : le ressort ne doit jamais dépasser 0 % ou 100 %
  const barStyle = useAnimatedStyle(() => ({
    width: `${Math.min(Math.max(animatedProgress.get(), 0), 1) * 100}%`,
  }));
  const heartStyle = useAnimatedStyle(() => ({ transform: [{ scale: heartScale.get() }] }));

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

      {/* Barre de progression : le rail gris + la partie verte de largeur animée */}
      <View
        accessibilityRole="progressbar"
        accessibilityLabel="Progression de la leçon"
        accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
        className="h-3 flex-1 overflow-hidden rounded-full bg-disabled"
      >
        <Animated.View className="h-full rounded-full bg-green" style={barStyle}>
          {/* Petit reflet clair en haut de la barre : elle paraît en relief */}
          <View className="mx-1.5 mt-[2px] h-[3px] rounded-full bg-white/25" />
        </Animated.View>
      </View>

      <View
        accessible
        accessibilityLabel={hearts === null ? "Vies illimitées" : `${hearts} vies`}
        className="h-10 flex-row items-center gap-1 px-2.5"
      >
        <Animated.View style={heartStyle}>
          <Ionicons name="heart" size={20} color="#E5484D" />
        </Animated.View>
        <Text className="font-body-black text-base text-[#B42318]">{hearts === null ? "∞" : hearts}</Text>
      </View>
    </View>
  );
}
