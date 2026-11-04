import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { CHOICE_LOOK_CLASSES, type ChoiceLook } from "@/components/lesson/choice-look";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Colors } from "@/constants/theme";

type ChoiceOptionProps = {
  label: string;
  /** Petit repère à gauche : « 1 », « 2 »… ou « A », « B »… */
  badge: string;
  /** 2e ligne facultative sous le texte (ex. « 100 dërëm = 500 F CFA ») */
  sublabel?: string;
  /** "title" pour un mot wolof (police des titres), "body" pour une phrase française */
  labelFont?: "body" | "title";
  look: ChoiceLook;
  disabled: boolean;
  onPress: () => void;
};

/** Une réponse à choisir (QCM, dërëm…) : repère + texte + ✓ ou ✕ après vérification. */
export function ChoiceOption({
  label,
  badge,
  sublabel,
  labelFont = "body",
  look,
  disabled,
  onPress,
}: ChoiceOptionProps) {
  const classes = CHOICE_LOOK_CLASSES[look];
  const labelClasses = labelFont === "title" ? "font-title text-[19px]" : "font-body-black text-[17px]";

  // Deux réactions après « Vérifier » : trembler (mauvaise réponse) ou sauter (bonne réponse)
  const shakeX = useSharedValue(0);
  const pop = useSharedValue(1);

  useEffect(() => {
    if (look === "wrong") {
      // withSequence : plusieurs mouvements à la suite → gauche, droite ×3, puis retour au centre
      shakeX.set(
        withSequence(
          withTiming(-8, { duration: 50 }),
          withRepeat(withTiming(8, { duration: 100 }), 3, true),
          withTiming(0, { duration: 50 }),
        ),
      );
    }
    if (look === "correct") {
      pop.set(withSequence(withTiming(1.05, { duration: 120 }), withSpring(1, { damping: 8 })));
    }
  }, [look, shakeX, pop]);

  const reactionStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.get() }, { scale: pop.get() }],
  }));

  return (
    <Animated.View style={reactionStyle}>
      <PressableScale
        pressedScale={0.97}
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="radio"
        accessibilityState={{ checked: look === "selected", disabled }}
        className={`min-h-[60px] flex-row items-center gap-3.5 rounded-2xl border-2 border-b-[6px] px-3.5 py-2 ${classes.card}`}
      >
        <View className={`h-8 w-8 items-center justify-center rounded-[10px] ${classes.badge}`}>
          <Text className={`font-body-black text-[15px] ${classes.badgeText}`}>{badge}</Text>
        </View>

        <View className="flex-1">
          <Text className={`${labelClasses} ${classes.text}`}>{label}</Text>
          {sublabel && <Text className="font-body-bold text-[12.5px] text-muted">{sublabel}</Text>}
        </View>

        {look === "correct" && (
          <View className="h-7 w-7 items-center justify-center rounded-full bg-green">
            <Ionicons name="checkmark" size={16} color={Colors.white} />
          </View>
        )}
        {look === "wrong" && (
          <View className="h-7 w-7 items-center justify-center rounded-full bg-red">
            <Ionicons name="close" size={16} color={Colors.white} />
          </View>
        )}
      </PressableScale>
    </Animated.View>
  );
}
