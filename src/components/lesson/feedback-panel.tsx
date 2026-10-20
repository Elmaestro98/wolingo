import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Colors } from "@/constants/theme";

type FeedbackPanelProps = {
  isCorrect: boolean;
  /** Texte de la bonne réponse (affiché seulement en cas d'erreur) */
  correctAnswer: string;
  explanation: string;
  /** XP gagnés si la réponse est juste */
  xp: number;
  /** Hauteur de la barre du bas de l'iPhone : le panneau coloré descend jusqu'au bord */
  bottomInset: number;
  onContinue: () => void;
};

/** Panneau de correction en bas de l'écran, vert (bravo) ou rouge (erreur). Commun à tous les exercices. */
export function FeedbackPanel({
  isCorrect,
  correctAnswer,
  explanation,
  xp,
  bottomInset,
  onContinue,
}: FeedbackPanelProps) {
  return (
    <View
      accessibilityLiveRegion="polite"
      style={{ paddingBottom: bottomInset + 8 }}
      className={`gap-3 rounded-t-3xl px-5 pt-[18px] ${isCorrect ? "bg-[#D7EDDF]" : "bg-[#FBE3E3]"}`}
    >
      <View className="flex-row items-center gap-3">
        <View
          className={`h-11 w-11 items-center justify-center rounded-full ${isCorrect ? "bg-green" : "bg-red"}`}
        >
          <Ionicons name={isCorrect ? "checkmark-sharp" : "close"} size={24} color={Colors.white} />
        </View>
        <View className="flex-1">
          <Text className={`font-title text-[22px] ${isCorrect ? "text-green-dark" : "text-red-shadow"}`}>
            {isCorrect ? "Baax na ! Bravo" : "Pas tout à fait…"}
          </Text>
          <Text className={`font-body-bold text-[13px] ${isCorrect ? "text-green" : "text-red-shadow"}`}>
            {isCorrect ? `+${xp} XP` : `Bonne réponse : ${correctAnswer}`}
          </Text>
        </View>
      </View>

      <Text className={`font-body text-sm leading-5 ${isCorrect ? "text-[#1F3D2C]" : "text-[#5C1A1D]"}`}>
        {explanation}
      </Text>

      <Button
        title={isCorrect ? "Continuer" : "J'ai compris"}
        variant={isCorrect ? "primary" : "danger"}
        onPress={onContinue}
      />
    </View>
  );
}
