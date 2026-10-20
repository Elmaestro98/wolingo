import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

import { CHOICE_LOOK_CLASSES, getChoiceLook, type ChoiceLook } from "@/components/lesson/choice-look";
import { Colors } from "@/constants/theme";
import { CONTENT_IMAGES } from "@/content/images";
import type { MultipleChoiceStepData } from "@/content/lessons";

type MultipleChoiceStepProps = {
  step: MultipleChoiceStepData;
  /** true une fois que l'utilisateur a touché « Vérifier » : on montre la correction */
  checked: boolean;
  /** Prévient le lecteur (le parent) à chaque choix : la réponse est-elle juste ? */
  onAnswerChange: (isCorrect: boolean) => void;
};

/** Exercice QCM (écran 08) : traduire une phrase wolof en choisissant parmi 4 propositions. */
export function MultipleChoiceStep({ step, checked, onAnswerChange }: MultipleChoiceStepProps) {
  // Le choix sélectionné (null = rien de choisi). Mémoire propre à l'exercice.
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  function handleSelect(index: number) {
    setSelectedIndex(index);
    onAnswerChange(index === step.answerIndex); // on remonte l'info au lecteur
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
                  se prononce <Text className="font-body-bold italic text-[#3D3730]">[{step.pronunciation}]</Text>
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
            number={index + 1}
            look={getChoiceLook(index, selectedIndex, step.answerIndex, checked)}
            disabled={checked}
            onPress={() => handleSelect(index)}
          />
        ))}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Un choix de réponse
// ---------------------------------------------------------------------------

type ChoiceOptionProps = {
  label: string;
  number: number;
  look: ChoiceLook;
  disabled: boolean;
  onPress: () => void;
};

function ChoiceOption({ label, number, look, disabled, onPress }: ChoiceOptionProps) {
  const classes = CHOICE_LOOK_CLASSES[look];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ checked: look === "selected", disabled }}
      className={`h-[60px] flex-row items-center gap-3.5 rounded-2xl border-2 border-b-[6px] px-3.5 ${classes.card}`}
    >
      <View className={`h-8 w-8 items-center justify-center rounded-[10px] ${classes.badge}`}>
        <Text className={`font-body-black text-[15px] ${classes.badgeText}`}>{number}</Text>
      </View>
      <Text className={`flex-1 font-body-black text-[17px] ${classes.text}`}>{label}</Text>

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
    </Pressable>
  );
}
