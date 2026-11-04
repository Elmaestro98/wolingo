import * as Haptics from "expo-haptics";
import type { ReactNode } from "react";
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type PressableScaleProps = Omit<PressableProps, "children"> & {
  children: ReactNode;
  /** Taille pendant l'appui (1 = taille normale, 0.95 = 5 % plus petit) */
  pressedScale?: number;
  /** Petit « tic » de vibration au moment de l'appui */
  haptic?: boolean;
  /** Style de l'enveloppe animée (ex. { width: "100%" } pour un bouton pleine largeur) */
  containerStyle?: StyleProp<ViewStyle>;
};

// Ressort vif : le bouton rétrécit vite et revient avec un léger rebond
const SPRING = { damping: 12, stiffness: 400 };

/**
 * Un Pressable qui « rebondit » quand on le touche (comme les boutons de Duolingo).
 * S'utilise exactement comme Pressable : className, onPress, disabled, accessibilité…
 */
export function PressableScale({
  children,
  pressedScale = 0.95,
  haptic = true,
  containerStyle,
  onPressIn,
  onPressOut,
  ...pressableProps
}: PressableScaleProps) {
  // useSharedValue : une valeur que l'animation modifie SANS re-dessiner le composant (rapide)
  const scale = useSharedValue(1);
  // Vrai si la personne a activé « Réduire les animations » sur son téléphone
  const reduceMotion = useReducedMotion();

  // useAnimatedStyle : un style recalculé à chaque image de l'animation
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <Animated.View style={[containerStyle, animatedStyle]}>
      <Pressable
        onPressIn={(event) => {
          // withSpring : on va vers la nouvelle taille avec un effet ressort
          // .set() : la façon de modifier une valeur partagée (autorisée par les règles de React)
          if (!reduceMotion) scale.set(withSpring(pressedScale, SPRING));
          if (haptic) Haptics.selectionAsync();
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          scale.set(withSpring(1, SPRING));
          onPressOut?.(event);
        }}
        {...pressableProps}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
