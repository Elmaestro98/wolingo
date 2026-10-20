import Ionicons from "@expo/vector-icons/Ionicons";
import { Alert, Text, View } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { Colors } from "@/constants/theme";
import { useNow } from "@/hooks/use-now";
import {
  computeHearts,
  formatCountdown,
  getTimeUntilNextHeart,
  MAX_HEARTS,
  type HeartsState,
} from "@/lib/hearts";

type OutOfHeartsProps = {
  /** Les vies sauvegardées (pour calculer le compte à rebours) */
  savedHearts: HeartsState;
  onBack: () => void;
};

/** Écran affiché à un utilisateur gratuit qui n'a plus de vies (pas dans la maquette : ajouté). */
export function OutOfHearts({ savedHearts, onBack }: OutOfHeartsProps) {
  // Se redessine chaque seconde → le compte à rebours avance tout seul
  const now = useNow(1000);
  const timeLeft = getTimeUntilNextHeart(savedHearts, now);
  // Si l'utilisateur attend sur cet écran, une vie peut revenir pendant ce temps
  const heartsNow = computeHearts(savedHearts, now).hearts;
  const hasHeartAgain = heartsNow > 0;

  function handlePremium() {
    // Le paiement est hors V1 : on annonce simplement l'offre pour l'instant
    Alert.alert("Wolingo Premium", "Vies illimitées, bientôt disponible !");
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <Animated.View
          entering={ZoomIn.springify().damping(12)}
          className="h-28 w-28 items-center justify-center rounded-full bg-red-light"
        >
          <Ionicons name="heart-dislike" size={56} color={Colors.red} />
        </Animated.View>

        <Text className="font-title text-[32px] text-ink">
          {hasHeartAgain ? "Une vie est revenue !" : "Plus de vies !"}
        </Text>
        <Text className="text-center font-body text-base leading-6 text-muted">
          {hasHeartAgain
            ? "Retourne au parcours pour reprendre ta leçon."
            : "Une vie revient toutes les 30 minutes. Profites-en pour revoir tes mots : ndank-ndank !"}
        </Text>

        {/* Les 5 cœurs : pleins pour les vies déjà revenues, vides pour les autres */}
        <View className="flex-row gap-1.5">
          {Array.from({ length: MAX_HEARTS }, (_, index) => (
            <Ionicons
              key={index}
              name={index < heartsNow ? "heart" : "heart-outline"}
              size={26}
              color={index < heartsNow ? "#E5484D" : Colors.disabled}
            />
          ))}
        </View>

        {timeLeft !== null && (
          <View className="rounded-2xl bg-white px-5 py-3">
            <Text className="text-center font-body text-sm text-muted">Prochaine vie dans</Text>
            <Text className="text-center font-title text-[34px] text-red">{formatCountdown(timeLeft)}</Text>
          </View>
        )}
      </View>

      <View className="gap-2 px-6 pb-2">
        <Button title="Vies illimitées avec Premium" arrow onPress={handlePremium} />
        <Button title="Retour au parcours" variant="white" onPress={onBack} />
      </View>
    </SafeAreaView>
  );
}
