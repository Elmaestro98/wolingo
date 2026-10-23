import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { Colors } from "@/constants/theme";
import { useNow } from "@/hooks/use-now";
import { addDaysToKey } from "@/lib/dates";
import { getDueRefs, REVIEW_INTERVALS_DAYS, REVIEW_SESSION_ID, REVIEW_SESSION_SIZE } from "@/lib/review";
import { useProgressStore } from "@/stores/progress-store";

/** « 2026-10-24 » → « demain » / « le 24/10 » */
function formatDueDay(dateKey: string, today: Date): string {
  if (dateKey === addDaysToKey(today, 1)) return "demain";
  const [, month, day] = dateKey.split("-");
  return `le ${day}/${month}`;
}

/** Onglet « Révision » : la révision espacée (cahier des charges : J+1, J+3, J+7). */
export default function ReviewScreen() {
  const reviewItems = useProgressStore((state) => state.reviewItems);
  // L'heure en mémoire (rafraîchie chaque minute) : à minuit, de nouveaux exercices deviennent « à revoir »
  const today = new Date(useNow(60_000));

  const dueCount = getDueRefs(reviewItems, today).length;
  const allItems = Object.values(reviewItems);
  const sessionSize = Math.min(dueCount, REVIEW_SESSION_SIZE);

  // La prochaine date de révision parmi les exercices PAS encore à revoir
  const upcomingKeys = allItems
    .map((item) => item.dueDateKey)
    .filter((key) => key > addDaysToKey(today, 0))
    .sort();
  const nextDueKey = upcomingKeys[0];

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-cream">
      <ScrollView contentContainerClassName="gap-5 px-4 pb-10" showsVerticalScrollIndicator={false}>
        <View className="px-2 pt-3.5">
          <Text className="font-body-black text-[11.5px] uppercase tracking-[1.6px] text-yellow-text">
            Wolingo
          </Text>
          <Text className="font-title text-[26px] leading-[29px] text-ink">Révision</Text>
        </View>

        {/* Carte principale : à revoir aujourd'hui, ou rien */}
        <View className="items-center gap-3 rounded-[24px] bg-white p-5">
          <Image source={require("@/assets/images/mascot.png")} className="h-24 w-24 rounded-full" />
          {dueCount > 0 ? (
            <>
              <Text className="text-center font-title text-2xl text-ink">
                {dueCount} exercice{dueCount > 1 ? "s" : ""} à revoir
              </Text>
              <Text className="text-center font-body text-[15px] leading-[22px] text-muted">
                Ceux que tu as ratés reviennent juste avant que tu les oublies. Ndank-ndank !
              </Text>
              <Button
                title={`Commencer la révision (${sessionSize})`}
                arrow
                onPress={() => router.push(`/lesson/${REVIEW_SESSION_ID}`)}
              />
            </>
          ) : (
            <>
              <Text className="text-center font-title text-2xl text-ink">Rien à réviser aujourd'hui</Text>
              <Text className="text-center font-body text-[15px] leading-[22px] text-muted">
                {nextDueKey
                  ? `Prochaine révision ${formatDueDay(nextDueKey, today)}. En attendant, avance sur le Parcours !`
                  : "Les exercices que tu rates reviendront ici pour être revus. Continue le Parcours !"}
              </Text>
            </>
          )}
        </View>

        {/* La méthode : les paliers, avec le nombre d'exercices à chacun */}
        <View className="gap-3">
          <Text className="px-2 font-body-black text-xs uppercase tracking-[1.4px] text-muted">
            La méthode
          </Text>
          <View className="flex-row items-center gap-1.5">
            {REVIEW_INTERVALS_DAYS.map((days, index) => {
              const count = allItems.filter((item) => item.intervalIndex === index).length;
              return (
                <View key={days} className="flex-1 flex-row items-center gap-1.5">
                  <View className="flex-1 items-center gap-0.5 rounded-2xl bg-white py-3">
                    <Text className="font-title text-lg text-green">J+{days}</Text>
                    <Text className="font-body-bold text-xs text-muted">
                      {count} exercice{count > 1 ? "s" : ""}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={14} color={Colors.disabled} />
                </View>
              );
            })}
            <View className="items-center gap-0.5 rounded-2xl bg-green-light px-3 py-3">
              <Ionicons name="checkmark-circle" size={22} color={Colors.green} />
              <Text className="font-body-bold text-xs text-green">Maîtrisé</Text>
            </View>
          </View>
          <Text className="px-2 font-body text-[13px] leading-5 text-muted">
            Un exercice raté revient le lendemain. Réussi, il revient 3 jours plus tard, puis 7 jours plus
            tard. Réussi une dernière fois, il est maîtrisé. Raté en révision, il repart à J+1.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
