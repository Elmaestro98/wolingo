import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

import { getChoiceLook } from "@/components/lesson/choice-look";
import { ChoiceOption } from "@/components/lesson/choice-option";
import { Colors } from "@/constants/theme";
import { CONTENT_IMAGES } from "@/content/images";
import type { MultipleChoiceStepData } from "@/content/lessons";

type MultipleChoiceStepProps = {
  step: MultipleChoiceStepData;
  /** true une fois que l'utilisateur a touché « Vérifier » : on montre la correction */
  checked: boolean;
  /** Prévient le lecteur (le parent) à chaque choix : la réponse est-elle juste ? + le texte choisi */
  onAnswerChange: (isCorrect: boolean, answerText: string) => void;
};

/** Exercice QCM (écran 08) : traduire une phrase wolof en choisissant parmi 4 propositions. */
export function MultipleChoiceStep({ step, checked, onAnswerChange }: MultipleChoiceStepProps) {
  // Le choix sélectionné (null = rien de choisi). Mémoire propre à l'exercice.
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  function handleSelect(index: number) {
    setSelectedIndex(index);
    onAnswerChange(index === step.answerIndex, step.choices[index]); // on remonte l'info au lecteur
  }

  return (
    <View className="gap-4">
      {/* Consigne */}
      <View className="items-start gap-2.5">
        <View className="flex-row items-center gap-1.5 rounded-full bg-yellow-light px-2.5 py-1">
          <Ionicons name="star" size={12} color={Colors.yellow} />
          <Text className="font-body-black text-[11.5px] uppercase tracking-[1.1px] text-[#6B4700]">
            {step.eyebrow}
          </Text>
        </View>
        <Text className="font-title text-2xl text-ink">{step.question}</Text>
      </View>

      {/* La phrase wolof, avec la photo à gauche si l'étape en a une */}
      <View className="flex-row gap-3">
        {step.image && (
          <Image source={CONTENT_IMAGES[step.image]} className="h-32 w-[104px] rounded-[18px]" />
        )}
        <View className="flex-1 justify-between gap-2 rounded-[18px] rounded-bl-md bg-white p-3.5">
          <View className="flex-row items-center justify-between gap-2">
            <View className="shrink gap-0.5">
              <Text className="font-title text-[30px] leading-[32px] text-ink">{step.prompt}</Text>
              {step.pronunciation && (
                <Text className="font-body text-[13px] text-muted">
                  se prononce{" "}
                  <Text className="font-body-bold italic text-[#3D3730]">[{step.pronunciation}]</Text>
                </Text>
              )}
            </View>
            <Pressable
              // Plus tard : jouer l'audio avec expo-audio
              onPress={() => {}}
              accessibilityRole="button"
              accessibilityLabel={`Écouter « ${step.prompt} »`}
              className="h-[52px] w-[52px] items-center justify-center rounded-2xl border-b-4 border-green-shadow bg-green active:mt-1 active:border-b-0"
            >
              <Ionicons name="volume-high-outline" size={24} color={Colors.white} />
            </Pressable>
          </View>
          {step.context && <Text className="font-body text-[12.5px] text-muted">{step.context}</Text>}
        </View>
      </View>

      {/* Les choix */}
      <View className="gap-2.5" accessibilityRole="radiogroup">
        {step.choices.map((choice, index) => (
          <ChoiceOption
            key={choice}
            label={choice}
            badge={String(index + 1)}
            look={getChoiceLook(index, selectedIndex, step.answerIndex, checked)}
            disabled={checked}
            onPress={() => handleSelect(index)}
          />
        ))}
      </View>
    </View>
  );
}
