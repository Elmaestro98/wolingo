import { useState } from "react";
import { Image, Text, View } from "react-native";

import { getChoiceLook } from "@/components/lesson/choice-look";
import { ChoiceOption } from "@/components/lesson/choice-option";
import { CONTENT_IMAGES } from "@/content/images";
import type { DeremStepData } from "@/content/lessons";
import { CFA_PER_DEREM, deremToCfa, findDeremAnswerIndex, formatNumber } from "@/lib/derem";

type DeremStepProps = {
  step: DeremStepData;
  checked: boolean;
  onAnswerChange: (isCorrect: boolean) => void;
};

/** Lettres des repères : A, B, C, D… */
const LETTERS = ["A", "B", "C", "D", "E", "F"];

/** Exercice « dërëm » (écran 15) : choisir le montant en dërëm qui correspond au prix en F CFA. */
export function DeremStep({ step, checked, onAnswerChange }: DeremStepProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // La bonne réponse est CALCULÉE à partir des données, pas écrite à la main
  const answerIndex = findDeremAnswerIndex(
    step.priceCfa,
    step.choices.map((choice) => choice.derem),
  );

  function handleSelect(index: number) {
    setSelectedIndex(index);
    onAnswerChange(index === answerIndex);
  }

  return (
    <View className="gap-4">
      {/* Consigne */}
      <View className="gap-1">
        <Text className="font-body-black text-xs uppercase tracking-[1.7px] text-yellow-text">
          {step.eyebrow}
        </Text>
        <Text className="font-title text-2xl text-ink">{step.question}</Text>
      </View>

      {/* Le prix, avec la pièce */}
      <View className="flex-row items-center gap-3.5 rounded-[22px] bg-white p-3.5">
        <Image source={CONTENT_IMAGES[step.image]} className="h-[108px] w-[108px]" resizeMode="contain" />
        <View className="flex-1 items-start gap-2">
          <Text className="font-title text-[32px] leading-[34px] text-ink">
            {formatNumber(step.priceCfa)} F CFA
          </Text>
          <Text className="font-body text-sm text-muted">
            = combien de <Text className="font-body-black text-ink">dërëm</Text> ?
          </Text>
          <View className="rounded-[10px] bg-yellow-light px-2.5 py-1">
            <Text className="font-body-black text-[13px] text-[#5A4300]">
              1 dërëm = {CFA_PER_DEREM} F CFA
            </Text>
          </View>
        </View>
      </View>

      {/* Les choix : après vérification, chacun révèle sa valeur (aide à comprendre l'erreur) */}
      <View className="gap-2.5" accessibilityRole="radiogroup">
        {step.choices.map((choice, index) => (
          <ChoiceOption
            key={choice.wolof}
            label={choice.wolof}
            labelFont="title"
            badge={LETTERS[index]}
            sublabel={
              checked
                ? `${formatNumber(choice.derem)} dërëm = ${formatNumber(deremToCfa(choice.derem))} F CFA`
                : undefined
            }
            look={getChoiceLook(index, selectedIndex, answerIndex, checked)}
            disabled={checked}
            onPress={() => handleSelect(index)}
          />
        ))}
      </View>
    </View>
  );
}
