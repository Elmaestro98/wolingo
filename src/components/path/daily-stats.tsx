import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";

import { ProgressRing } from "@/components/path/progress-ring";
import { Colors } from "@/constants/theme";

type DailyStatsProps = {
  totalXp: number;
  minutesToday: number;
  dailyGoalMinutes: number;
};

/** Carte blanche « XP total | objectif du jour » sous la carte du module. */
export function DailyStats({ totalXp, minutesToday, dailyGoalMinutes }: DailyStatsProps) {
  return (
    <View className="flex-row rounded-[18px] bg-white px-3.5 py-3">
      {/* Moitié gauche : XP */}
      <View className="flex-1 flex-row items-center gap-2.5">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-yellow-light">
          <Ionicons name="flash" size={20} color={Colors.yellow} />
        </View>
        <View>
          <Text className="font-body-black text-[17px] text-ink">{totalXp} XP</Text>
          <Text className="font-body text-xs text-muted">Total gagné</Text>
        </View>
      </View>

      {/* Moitié droite : objectif du jour, séparée par un trait vertical (border-l) */}
      <View className="flex-1 flex-row items-center gap-2.5 border-l border-[#F0EADF] pl-3">
        <ProgressRing progress={minutesToday / dailyGoalMinutes} />
        <View>
          <Text className="font-body-black text-[17px] text-ink">
            {minutesToday} / {dailyGoalMinutes} min
          </Text>
          <Text className="font-body text-xs text-muted">Objectif du jour</Text>
        </View>
      </View>
    </View>
  );
}
