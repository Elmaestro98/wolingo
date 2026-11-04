import { useEffect } from "react";
import { Image, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";

import type { MascotReaction as MascotReactionData } from "@/lib/mascot";

// Tailles du lion : plus discret après une erreur
const SIZES = {
  happy: { width: 140, height: 121, top: -112 },
  combo: { width: 140, height: 121, top: -112 },
  sad: { width: 112, height: 97, top: -88 },
} as const;

/**
 * Le lion qui « dépasse » au-dessus du panneau de correction, et réagit selon son humeur :
 * - happy : un petit saut ;
 * - combo : deux sauts en se dandinant + bulle « 3 d'affilée ! » ;
 * - sad : tête penchée, il fait doucement « non », + bulle d'encouragement.
 */
export function MascotReaction({ mood, message }: MascotReactionData) {
  const reduceMotion = useReducedMotion();
  const jump = useSharedValue(0); //  hauteur (négatif = vers le haut)
  const tilt = useSharedValue(0); //  inclinaison, en degrés

  useEffect(() => {
    if (reduceMotion) {
      if (mood === "sad") tilt.set(-10); // tête penchée, sans mouvement
      return;
    }
    const up = { duration: 200, easing: Easing.out(Easing.quad) };
    const down = { duration: 200, easing: Easing.in(Easing.quad) };

    if (mood === "happy") {
      // withDelay : on attend que le lion ait fini d'apparaître (ZoomIn) avant de sauter
      jump.set(withDelay(350, withSequence(withTiming(-12, up), withTiming(0, down))));
    }
    if (mood === "combo") {
      // Deux sauts…
      jump.set(withDelay(350, withRepeat(withSequence(withTiming(-18, up), withTiming(0, down)), 2)));
      // … pendant qu'il se dandine de gauche à droite
      tilt.set(
        withDelay(
          350,
          withSequence(
            withTiming(-8, { duration: 150 }),
            withTiming(8, { duration: 200 }),
            withTiming(-6, { duration: 200 }),
            withTiming(0, { duration: 150 }),
          ),
        ),
      );
    }
    if (mood === "sad") {
      // Il penche la tête et descend un peu…
      jump.set(withDelay(300, withTiming(6, { duration: 400 })));
      // … puis fait « non » doucement, deux fois (va-et-vient entre -10° et -4°)
      tilt.set(
        withDelay(
          300,
          withSequence(
            withTiming(-10, { duration: 400 }),
            withRepeat(withTiming(-4, { duration: 350, easing: Easing.inOut(Easing.quad) }), 4, true),
          ),
        ),
      );
    }
  }, [mood, reduceMotion, jump, tilt]);

  const lionStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: jump.get() }, { rotate: `${tilt.get()}deg` }],
  }));

  const size = SIZES[mood];

  return (
    // Placé AU-DESSUS du panneau : position absolute avec un top NÉGATIF
    <View pointerEvents="none" className="absolute right-2 flex-row items-start" style={{ top: size.top }}>
      {message !== null && (
        // La bulle apparaît juste après le lion. Coin en bas à droite pointu : elle « sort » de sa bouche
        <Animated.View
          entering={ZoomIn.delay(300).springify().damping(14)}
          className="mr-1 mt-3 max-w-[190px] rounded-[18px] rounded-br-[4px] bg-white px-3.5 py-2 shadow-md"
        >
          <Text className={`font-body-black text-[14px] ${mood === "sad" ? "text-[#A3242A]" : "text-green"}`}>
            {message}
          </Text>
        </Animated.View>
      )}

      <Animated.View entering={ZoomIn.delay(150).springify().damping(12)}>
        <Animated.View style={lionStyle}>
          <Image
            source={require("@/assets/images/lion-bust.png")}
            style={{ width: size.width, height: size.height }}
            accessibilityIgnoresInvertColors
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}
