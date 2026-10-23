import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";

import { Colors, Fonts } from "@/constants/theme";
import { CONTENT_IMAGES } from "@/content/images";
import type { WriteTranslationStepData } from "@/content/lessons";
import { checkTypedAnswer } from "@/lib/answer-checker";

/** Lettres wolof absentes des claviers français, insérables d'un toucher. */
const WOLOF_LETTERS = ["ë", "é", "ñ", "ŋ", "à", "ó"];

type WriteTranslationStepProps = {
  step: WriteTranslationStepData;
  checked: boolean;
  /** null = champ vide (le bouton « Vérifier » se grise) */
  onAnswerChange: (isCorrect: boolean | null, answerText?: string) => void;
};

/** Exercice « écrire en wolof » (écran 12) : taper la traduction, avec correction tolérante. */
export function WriteTranslationStep({ step, checked, onAnswerChange }: WriteTranslationStepProps) {
  // Le texte tapé : c'est LUI qui commande le contenu du champ (« champ contrôlé »)
  const [text, setText] = useState("");
  const [isHintVisible, setIsHintVisible] = useState(false);

  /** Met à jour le texte et prévient le lecteur. */
  function updateText(newText: string) {
    setText(newText);
    if (newText.trim() === "") {
      onAnswerChange(null);
      return;
    }
    // « near » (accents oubliés) compte comme juste : c'est la correction tolérante
    onAnswerChange(checkTypedAnswer(newText, step.acceptedAnswers) !== "wrong", newText);
  }

  // Après vérification : le verdict sert à colorer le champ et à afficher la remarque « presque »
  const verdict = checked ? checkTypedAnswer(text, step.acceptedAnswers) : null;
  const fieldBorder =
    verdict === null ? "border-green" : verdict === "wrong" ? "border-red bg-[#FFF7F7]" : "border-green";

  return (
    <View className="gap-3">
      {/* Consigne */}
      <View className="gap-1">
        <Text className="font-body-black text-xs uppercase tracking-[1.7px] text-yellow-text">{step.eyebrow}</Text>
        <Text className="font-title text-2xl text-ink">{step.question}</Text>
      </View>

      {/* La phrase française, dite par le personnage */}
      <View className="flex-row items-center gap-3 rounded-[18px] bg-white px-3.5 py-3">
        <Image source={CONTENT_IMAGES[step.speaker.image]} className="h-10 w-10 rounded-full" />
        <View className="flex-1">
          <Text className="font-body-bold text-xs text-muted">{step.speaker.name} dit :</Text>
          <Text className="font-title text-xl leading-6 text-ink">« {step.sourceText} »</Text>
        </View>
      </View>

      {/* Le champ de saisie */}
      <View className={`min-h-16 flex-row items-center gap-2.5 rounded-[18px] border-2 bg-white py-2 pl-4 pr-3 ${fieldBorder}`}>
        <TextInput
          value={text} //                 le champ AFFICHE la mémoire…
          onChangeText={updateText} //    …et chaque frappe MET À JOUR la mémoire
          editable={!checked}
          placeholder="Écris ta traduction…"
          placeholderTextColor="#8C8274"
          autoCorrect={false} //          pas de « correction » française sur du wolof !
          spellCheck={false}
          autoCapitalize="sentences"
          accessibilityLabel="Ta traduction en wolof"
          className="flex-1 text-[22px] text-ink"
          // fontFamily via style : la police doit s'appliquer aussi au texte tapé
          style={{ fontFamily: Fonts.title }}
        />
        {text.length > 0 && !checked && (
          <Pressable
            onPress={() => updateText("")}
            accessibilityRole="button"
            accessibilityLabel="Effacer tout"
            className="h-9 w-9 items-center justify-center rounded-full bg-[#F3EEE5]"
          >
            <Ionicons name="close" size={18} color={Colors.muted} />
          </Pressable>
        )}
      </View>

      {/* Après vérification : remarque si les accents ou les doubles lettres ont été oubliés */}
      {verdict === "near" && (
        <Text className="rounded-xl bg-yellow-light px-3 py-2.5 font-body text-[13.5px] leading-5 text-[#5A4300]">
          <Text className="font-body-black">Presque parfait ! </Text>
          Attention aux accents et aux lettres doublées :{" "}
          <Text className="font-body-black">{step.acceptedAnswers[0]}</Text>
        </Text>
      )}

      {!checked && (
        <>
          {/* Les lettres wolof : chaque toucher ajoute la lettre à la fin du texte */}
          <View className="flex-row items-center gap-1.5">
            <Text className="mr-1 font-body-black text-[11px] uppercase tracking-[1px] text-muted">Wolof</Text>
            {WOLOF_LETTERS.map((letter) => (
              <Pressable
                key={letter}
                onPress={() => updateText(text + letter)}
                accessibilityRole="button"
                accessibilityLabel={`Insérer ${letter}`}
                className="h-11 flex-1 items-center justify-center rounded-[10px] border-b-2 border-[#DCD2C2] bg-white active:bg-sand"
              >
                <Text className="font-body-black text-lg text-green">{letter}</Text>
              </Pressable>
            ))}
          </View>

          {/* Indice */}
          {step.hint && (
            <View className="flex-row flex-wrap items-center gap-2">
              <Pressable
                onPress={() => setIsHintVisible(!isHintVisible)}
                accessibilityRole="button"
                accessibilityState={{ expanded: isHintVisible }}
                className="h-[34px] flex-row items-center gap-1.5 rounded-full bg-yellow-light px-3"
              >
                <Ionicons name="bulb-outline" size={15} color={Colors.yellowText} />
                <Text className="font-body-black text-[13px] text-[#6B4700]">Indice</Text>
              </Pressable>
              {isHintVisible && <Text className="font-body text-[13.5px] text-[#5A4300]">{step.hint}</Text>}
            </View>
          )}
        </>
      )}
    </View>
  );
}
