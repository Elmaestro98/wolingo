import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { Colors } from "@/constants/theme";
import { getStreakWeek, type StreakWeekDay } from "@/lib/streak";

/** Couleur de la flamme (la même que sur l'Accueil et le Profil) */
const FLAME = "#F59F0B";
/** Hauteur de la « fenêtre » où le chiffre défile */
const NUMBER_HEIGHT = 96;
/** Moment où l'ancien chiffre laisse la place au nouveau */
const SWAP_DELAY = 700;

type StreakCelebrationProps = {
  /** Série APRÈS la leçon d'aujourd'hui */
  streakDays: number;
  onContinue: () => void;
};

/** Écran de fête après la 1re leçon du jour : la flamme, le chiffre qui change, la semaine. */
export function StreakCelebration({ streakDays, onContinue }: StreakCelebrationProps) {
  const reduceMotion = useReducedMotion();
  // useState(() => …) : la semaine est calculée UNE fois, à l'ouverture de l'écran
  const [week] = useState(() => getStreakWeek(streakDays, new Date()));

  // 0 = on voit l'ancien chiffre (hier) ; 1 = on voit le nouveau (aujourd'hui)
  const swap = useSharedValue(reduceMotion ? 1 : 0);
  // La flamme « vacille » : elle grossit un peu en penchant, puis revient, en boucle
  const flicker = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    // Easing.back : le nouveau chiffre dépasse un peu sa place, puis s'y pose (effet « ressort »)
    swap.set(withDelay(SWAP_DELAY, withTiming(1, { duration: 450, easing: Easing.out(Easing.back(1.6)) })));
    flicker.set(withRepeat(withTiming(1, { duration: 600, easing: Easing.inOut(Easing.quad) }), -1, true));
    return () => cancelAnimation(flicker);
  }, [reduceMotion, swap, flicker]);

  // Vibration de victoire au moment où le chiffre change
  useEffect(() => {
    const timer = setTimeout(
      () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
      reduceMotion ? 0 : SWAP_DELAY,
    );
    return () => clearTimeout(timer);
  }, [reduceMotion]);

  const flameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + flicker.get() * 0.06 }, { rotate: `${(flicker.get() - 0.5) * 6}deg` }],
  }));
  // L'ancien chiffre monte et s'efface ; le nouveau arrive par en dessous
  const oldNumberStyle = useAnimatedStyle(() => ({
    opacity: 1 - swap.get(),
    transform: [{ translateY: -swap.get() * NUMBER_HEIGHT }],
  }));
  const newNumberStyle = useAnimatedStyle(() => ({
    opacity: Math.min(swap.get(), 1),
    transform: [{ translateY: (1 - swap.get()) * NUMBER_HEIGHT }],
  }));

  const numberClasses = "absolute font-title text-[84px] leading-[96px] text-[#B86E00]";

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 items-center justify-center gap-2 px-6">
        {/* La flamme apparaît avec un rebond, puis vacille */}
        <Animated.View entering={ZoomIn.springify().damping(10)}>
          <Animated.View style={flameStyle}>
            <Ionicons name="flame" size={128} color={FLAME} />
          </Animated.View>
        </Animated.View>

        {/* La fenêtre du chiffre : overflow-hidden cache ce qui dépasse en haut et en bas */}
        <View
          accessible
          accessibilityLabel={`${streakDays} jour${streakDays > 1 ? "s" : ""} d'affilée`}
          style={{ height: NUMBER_HEIGHT }}
          className="w-full items-center overflow-hidden"
        >
          <Animated.Text style={oldNumberStyle} className={numberClasses}>
            {streakDays - 1}
          </Animated.Text>
          <Animated.Text style={newNumberStyle} className={numberClasses}>
            {streakDays}
          </Animated.Text>
        </View>

        <Text className="font-title text-[28px] text-[#3A2A00]">
          jour{streakDays > 1 ? "s" : ""} d'affilée !
        </Text>
        <Text className="text-center font-body text-[15.5px] text-muted">
          {streakDays === 1 ? "Ta série commence !" : "Ta série continue !"} Reviens demain pour la garder en
          vie.
        </Text>

        {/* La semaine, du lundi au dimanche */}
        <View className="mt-5 w-full flex-row justify-between rounded-[20px] bg-white px-3 py-4">
          {week.map((day) => (
            <WeekDay key={day.label} day={day} />
          ))}
        </View>
      </View>

      <View className="px-5 pb-2">
        <Button title="Continuer" arrow onPress={onContinue} />
      </View>
    </SafeAreaView>
  );
}

/** Un jour de la semaine : rond orange coché s'il fait partie de la série ; aujourd'hui « pop ». */
function WeekDay({ day }: { day: StreakWeekDay }) {
  const circle = (
    <View
      className={`h-9 w-9 items-center justify-center rounded-full ${day.isDone ? "bg-[#F59F0B]" : "bg-sand"}`}
    >
      {day.isDone && <Ionicons name="checkmark-sharp" size={18} color={Colors.white} />}
    </View>
  );

  return (
    <View className="items-center gap-1.5">
      {/* Le rond d'aujourd'hui apparaît juste après le changement de chiffre, avec un rebond */}
      {day.isToday ? (
        <Animated.View
          entering={ZoomIn.delay(SWAP_DELAY + 250)
            .springify()
            .damping(9)}
        >
          {circle}
        </Animated.View>
      ) : (
        circle
      )}
      <Text className={`font-body-black text-xs ${day.isToday ? "text-[#B86E00]" : "text-muted"}`}>
        {day.label}
      </Text>
    </View>
  );
}
