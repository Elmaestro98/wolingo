import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

import { CHOICE_LOOK_CLASSES, getChoiceLook } from "@/components/lesson/choice-look";
import { Colors } from "@/constants/theme";
import { CONTENT_IMAGES } from "@/content/images";
import type { FillBlankStepData } from "@/content/lessons";

type FillBlankStepProps = {
  step: FillBlankStepData;
  checked: boolean;
  onAnswerChange: (isCorrect: boolean) => void;
};

/** Exercice « compléter la phrase » (écran 10) : choisir le mot qui remplit le trou. */
export function FillBlankStep({ step, checked, onAnswerChange }: FillBlankStepProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  // L'indice est-il ouvert ?
  const [isHintVisible, setIsHintVisible] = useState(false);

  function handleSelect(index: number) {
    setSelectedIndex(index);
    onAnswerChange(index === step.answerIndex);
  }

  // Le mot affiché dans le trou (null tant que rien n'est choisi)
  const selectedWord = selectedIndex === null ? null : step.choices[selectedIndex];
  const isWrong = checked && selectedIndex !== step.answerIndex;

  return (
    <View className="gap-5">
      {/* Consigne */}
      <View className="gap-1">
        <Text className="font-body-black text-xs uppercase tracking-[1.7px] text-yellow-text">{step.eyebrow}</Text>
        <Text className="font-title text-2xl text-ink">{step.question}</Text>
      </View>

      {/* Carte de la phrase */}
      <View className="rounded-[22px] bg-white p-4">
        <View className="flex-row items-center gap-3">
          <Image
            source={CONTENT_IMAGES[step.speaker.image]}
            className="h-12 w-12 rounded-full bg-yellow-light"
          />
          <View className="flex-1">
            <Text className="font-body-black text-[15px] text-ink">{step.speaker.name}</Text>
            <Text className="font-body text-[12.5px] text-muted">{step.speaker.subtitle}</Text>
          </View>
          <Pressable
            // Plus tard : jouer l'audio avec expo-audio
            onPress={() => {}}
            accessibilityRole="button"
            accessibilityLabel="Écouter la phrase"
            className="h-[52px] w-[52px] items-center justify-center rounded-2xl border-b-4 border-green-shadow bg-green active:mt-1 active:border-b-0"
          >
            <Ionicons name="volume-high-outline" size={24} color={Colors.white} />
          </Pressable>
        </View>

        {/* La phrase : flex-wrap = les morceaux passent à la ligne s'ils ne tiennent pas */}
        <View className="mt-[18px] flex-row flex-wrap items-center justify-center gap-x-2.5 gap-y-2">
          <Text className="font-title text-[30px] text-ink">{step.before}</Text>
          <BlankSlot word={selectedWord} isWrong={isWrong} />
          <Text className="font-title text-[30px] text-ink">{step.after}</Text>
        </View>

        <Text className="mt-3.5 text-center font-body text-[14.5px] italic text-muted">« {step.translation} »</Text>
      </View>

      {/* Titre des choix + bouton Indice */}
      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="font-body-black text-xs uppercase tracking-[1.4px] text-muted">{step.choicesLabel}</Text>
          {step.hint && !checked && (
            <Pressable
              // ! inverse la valeur : ouvert → fermé, fermé → ouvert
              onPress={() => setIsHintVisible(!isHintVisible)}
              accessibilityRole="button"
              accessibilityState={{ expanded: isHintVisible }}
              className="h-9 flex-row items-center gap-1.5 rounded-full bg-yellow-light px-3"
            >
              <Ionicons name="bulb-outline" size={15} color={Colors.yellowText} />
              <Text className="font-body-black text-[13px] text-[#6B4700]">Indice</Text>
            </Pressable>
          )}
        </View>

        {isHintVisible && !checked && (
          <Text className="rounded-xl bg-yellow-light px-3 py-2.5 font-body text-[13.5px] leading-5 text-[#5A4300]">
            {step.hint}
          </Text>
        )}

        {/* Grille de 2 colonnes : chaque bouton prend ~la moitié (basis-[45%]) et grandit (grow) */}
        <View className="flex-row flex-wrap gap-2.5" accessibilityRole="radiogroup">
          {step.choices.map((choice, index) => {
            const classes = CHOICE_LOOK_CLASSES[getChoiceLook(index, selectedIndex, step.answerIndex, checked)];
            return (
              <Pressable
                key={choice}
                onPress={() => handleSelect(index)}
                disabled={checked}
                accessibilityRole="radio"
                accessibilityState={{ checked: index === selectedIndex, disabled: checked }}
                className={`h-16 grow basis-[45%] items-center justify-center rounded-2xl border-2 border-b-[6px] ${classes.card}`}
              >
                <Text className={`font-title text-xl ${classes.text}`}>{choice}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

/** Le « trou » de la phrase : vide (pointillés), rempli (vert) ou faux (rouge barré). */
function BlankSlot({ word, isWrong }: { word: string | null; isWrong: boolean }) {
  if (word === null) {
    return <View className="h-[52px] min-w-[118px] rounded-xl border-b-[3px] border-dashed border-[#CFC6B8] bg-[#F3EEE5]" />;
  }

  return (
    <View
      className={`h-[52px] min-w-[118px] items-center justify-center rounded-xl border-b-[3px] px-3.5 ${
        isWrong ? "border-red bg-red-light" : "border-green bg-green-light"
      }`}
    >
      <Text className={`font-title text-[30px] ${isWrong ? "text-red line-through" : "text-green"}`}>{word}</Text>
    </View>
  );
}
