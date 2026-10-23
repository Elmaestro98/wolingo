import Ionicons from "@expo/vector-icons/Ionicons";
import { Alert, Image, Pressable, Text, View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";

import { Button } from "@/components/ui/button";
import { Colors } from "@/constants/theme";
import { compareAnswerWords, type DiffWord } from "@/lib/answer-diff";

type FeedbackPanelProps = {
  isCorrect: boolean;
  /** Texte de la bonne réponse */
  correctAnswer: string;
  /** Ce que l'utilisateur a répondu (null si l'exercice n'a pas de réponse textuelle) */
  userAnswer: string | null;
  /** Traduction française de la bonne réponse, si l'exercice en a une */
  translation?: string;
  explanation: string;
  /** XP gagnés si la réponse est juste */
  xp: number;
  /** Une vie a-t-elle été perdue ? (faux pour un utilisateur Premium) */
  heartLost: boolean;
  /** Hauteur de la barre du bas de l'iPhone : le panneau coloré descend jusqu'au bord */
  bottomInset: number;
  onContinue: () => void;
};

/** Panneau de correction (maquettes 16 et 17), commun à tous les exercices. */
export function FeedbackPanel(props: FeedbackPanelProps) {
  // props.isCorrect choisit l'une des deux versions ; {...props} transmet toutes les props telles quelles
  return props.isCorrect ? <SuccessPanel {...props} /> : <MistakePanel {...props} />;
}

// ---------------------------------------------------------------------------
// Réussite (maquette 16) : fond vert foncé, le lion qui dépasse, +XP
// ---------------------------------------------------------------------------

function SuccessPanel({
  correctAnswer,
  translation,
  explanation,
  xp,
  bottomInset,
  onContinue,
}: FeedbackPanelProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(250)}
      accessibilityLiveRegion="polite"
      style={{ paddingBottom: bottomInset + 8 }}
      className="gap-4 rounded-t-[28px] bg-green px-5 pt-[22px]"
    >
      {/* Le lion « dépasse » au-dessus du panneau : position absolute avec un top NÉGATIF */}
      <Animated.View
        entering={ZoomIn.delay(150).springify().damping(12)}
        pointerEvents="none"
        className="absolute -top-[112px] right-2"
      >
        <Image source={require("@/assets/images/lion-bust.png")} className="h-[121px] w-[140px]" />
      </Animated.View>

      <View className="flex-row items-center gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-full bg-white">
          <Ionicons name="checkmark-sharp" size={24} color={Colors.green} />
        </View>
        <View className="flex-1">
          <Text className="font-title text-[28px] leading-[30px] text-white">Baax na !</Text>
          <Text className="font-body-black text-xs uppercase tracking-[1.2px] text-[#A9D3B8]">Excellent</Text>
        </View>
        <View className="flex-row items-center gap-1 rounded-full bg-yellow px-3 py-1.5">
          <Ionicons name="flash" size={14} color="#3A2A00" />
          <Text className="font-body-black text-sm text-[#3A2A00]">+{xp} XP</Text>
        </View>
      </View>

      {/* La bonne réponse, sa traduction et l'explication */}
      <View className="gap-1.5 rounded-2xl bg-white/10 p-4">
        {/* « Associer » n'a pas de phrase de réponse : correctAnswer est vide → on ne l'affiche pas */}
        {correctAnswer !== "" && <Text className="font-title text-2xl text-white">{correctAnswer}</Text>}
        {translation && <Text className="font-body text-sm italic text-[#D5EADD]">« {translation} »</Text>}
        {explanation !== "" && <Text className="font-body text-[13px] leading-5 text-[#D5EADD]">{explanation}</Text>}
      </View>

      <Button title="Continuer" variant="white" arrow onPress={onContinue} />
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Erreur (maquette 17) : « Ta réponse » barrée, « Bonne réponse » soulignée
// ---------------------------------------------------------------------------

function MistakePanel({
  correctAnswer,
  userAnswer,
  translation,
  explanation,
  heartLost,
  bottomInset,
  onContinue,
}: FeedbackPanelProps) {
  // Mot à mot : quels mots barrer dans ta réponse, quels mots souligner dans la bonne
  const diff = userAnswer ? compareAnswerWords(userAnswer, correctAnswer) : null;

  function handleReport() {
    // Plus tard : envoyer un signalement d'erreur de contenu au relecteur
    Alert.alert("Merci !", "Le signalement des erreurs de contenu arrive bientôt.");
  }

  return (
    <Animated.View
      entering={FadeInDown.duration(250)}
      accessibilityLiveRegion="polite"
      style={{ paddingBottom: bottomInset }}
      className="gap-3.5 rounded-t-[28px] bg-[#FFF1F1] px-5 pt-[22px]"
    >
      <View className="flex-row items-center gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-full bg-red">
          <Ionicons name="close" size={24} color={Colors.white} />
        </View>
        <View className="flex-1">
          <Text className="font-title text-[26px] leading-7 text-red-shadow">Pas tout à fait</Text>
          <Text className="font-body-bold text-[13.5px] text-[#A3242A]">Ne te décourage pas !</Text>
        </View>
        {heartLost && (
          <View className="flex-row items-center gap-1 rounded-full border border-[#F5C2C4] bg-white px-3 py-1.5">
            <Ionicons name="heart-outline" size={14} color={Colors.red} />
            <Text className="font-body-black text-sm text-red">−1</Text>
          </View>
        )}
      </View>

      <View className="gap-3 rounded-2xl border border-[#F5D5D6] bg-white p-4">
        {/* Ta réponse (si l'exercice en a une textuelle) */}
        {diff && (
          <View className="gap-1 border-b border-[#F0EADF] pb-3">
            <Text className="font-body-black text-[11.5px] uppercase tracking-[1.2px] text-disabled-text">
              Ta réponse
            </Text>
            <Text className="font-title text-lg text-ink">
              <DiffSentence words={diff.userWords} mode="strike" />
            </Text>
          </View>
        )}

        {/* La bonne réponse, avec les mots qui diffèrent soulignés */}
        <View className="gap-1">
          <Text className="font-body-black text-[11.5px] uppercase tracking-[1.2px] text-green">
            Bonne réponse
          </Text>
          <Text className="font-title text-2xl text-ink">
            {diff ? <DiffSentence words={diff.correctWords} mode="underline" /> : correctAnswer}
          </Text>
          {translation && <Text className="font-body text-sm italic text-muted">« {translation} »</Text>}
        </View>

        {explanation !== "" && (
          <View className="flex-row gap-2 rounded-xl bg-yellow-light p-3">
            <Ionicons name="bulb-outline" size={16} color={Colors.yellowText} />
            <Text className="flex-1 font-body text-[13px] leading-5 text-[#5A4300]">{explanation}</Text>
          </View>
        )}
      </View>

      <Button title="Compris" variant="danger" arrow onPress={onContinue} />

      <Pressable onPress={handleReport} className="h-10 flex-row items-center justify-center gap-1.5">
        <Ionicons name="flag-outline" size={15} color={Colors.muted} />
        <Text className="font-body-black text-sm text-muted">Signaler un problème</Text>
      </Pressable>
    </Animated.View>
  );
}

/**
 * Affiche une phrase mot par mot, en marquant les mots différents :
 * - « strike »    : barrés en rouge (dans TA réponse)
 * - « underline » : en vert, soulignés de jaune (dans la BONNE réponse)
 */
function DiffSentence({ words, mode }: { words: DiffWord[]; mode: "strike" | "underline" }) {
  return (
    <>
      {words.map((word, index) => (
        <Text key={index}>
          {index > 0 && " "}
          {word.isDifferent ? (
            mode === "strike" ? (
              <Text className="text-red line-through">{word.text}</Text>
            ) : (
              <Text
                className="text-green"
                style={{ textDecorationLine: "underline", textDecorationColor: Colors.yellow }}
              >
                {word.text}
              </Text>
            )
          ) : (
            word.text
          )}
        </Text>
      ))}
    </>
  );
}
