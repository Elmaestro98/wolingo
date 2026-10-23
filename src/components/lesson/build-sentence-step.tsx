import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeOut, LinearTransition, ZoomIn } from "react-native-reanimated";

import { Colors } from "@/constants/theme";
import type { BuildSentenceStepData } from "@/content/lessons";

type BuildSentenceStepProps = {
  step: BuildSentenceStepData;
  checked: boolean;
  /** null = aucune tuile posée (le bouton « Vérifier » se grise) */
  onAnswerChange: (isCorrect: boolean | null, answerText?: string) => void;
};

/** Hauteur d'une ligne de la zone réponse (tuile + espace) : sert aussi à tracer les lignes. */
const LINE_HEIGHT = 58;

/**
 * Exercice « construire la phrase » (écran 16) : toucher les tuiles dans le bon ordre.
 * Les tuiles sont repérées par leur position dans `step.tiles` (0, 1, 2…).
 */
export function BuildSentenceStep({ step, checked, onAnswerChange }: BuildSentenceStepProps) {
  // Les tuiles posées dans la phrase, dans l'ordre (positions dans step.tiles)
  const [placed, setPlaced] = useState<number[]>([]);

  /** Met à jour la phrase et prévient le lecteur. */
  function updatePlaced(newPlaced: number[]) {
    Haptics.selectionAsync(); // petit « tic » à chaque tuile
    setPlaced(newPlaced);

    if (newPlaced.length === 0) {
      onAnswerChange(null); // plus aucune tuile → plus de réponse
      return;
    }
    // Compare la phrase construite à la bonne réponse, mot par mot
    const builtSentence = newPlaced.map((tileIndex) => step.tiles[tileIndex]).join(" ");
    onAnswerChange(builtSentence === step.answer.join(" "), builtSentence);
  }

  function addTile(tileIndex: number) {
    updatePlaced([...placed, tileIndex]); // ajoute à la fin
  }

  function removeTile(tileIndex: number) {
    // filter : garde toutes les tuiles SAUF celle touchée
    updatePlaced(placed.filter((index) => index !== tileIndex));
  }

  // Après vérification : les tuiles de la phrase deviennent vertes (juste) ou rouges (faux)
  const builtSentence = placed.map((tileIndex) => step.tiles[tileIndex]).join(" ");
  const isCorrect = builtSentence === step.answer.join(" ");
  const answerLook = !checked ? "answer" : isCorrect ? "correct" : "wrong";

  return (
    <View className="gap-[18px]">
      {/* Consigne */}
      <View className="gap-1">
        <Text className="font-body-black text-xs uppercase tracking-[1.7px] text-yellow-text">{step.eyebrow}</Text>
        <Text className="font-title text-2xl text-ink">{step.question}</Text>
      </View>

      {/* La phrase française à traduire */}
      <View className="flex-row items-center gap-3 rounded-[18px] bg-white p-3.5">
        <Pressable
          // Plus tard : lire la phrase avec expo-audio
          onPress={() => {}}
          accessibilityRole="button"
          accessibilityLabel="Écouter la phrase"
          className="h-11 w-11 items-center justify-center rounded-full bg-green-light"
        >
          <Ionicons name="volume-high-outline" size={20} color={Colors.green} />
        </Pressable>
        <Text className="flex-1 font-title text-lg leading-6 text-ink">« {step.sourceText} »</Text>
      </View>

      {/* Zone réponse : deux lignes « de cahier » + les tuiles posées par-dessus */}
      <View style={{ minHeight: LINE_HEIGHT * 2 }}>
        <View className="absolute left-0 right-0 h-0.5 bg-sand" style={{ top: LINE_HEIGHT }} />
        <View className="absolute left-0 right-0 h-0.5 bg-sand" style={{ top: LINE_HEIGHT * 2 }} />

        <View className="flex-row flex-wrap gap-2 pt-1">
          {placed.map((tileIndex) => (
            // Animated.View : la tuile apparaît en grossissant (ZoomIn), disparaît en fondu (FadeOut),
            // et glisse en douceur quand les autres bougent (LinearTransition)
            <Animated.View
              key={tileIndex}
              entering={ZoomIn.duration(180)}
              exiting={FadeOut.duration(120)}
              layout={LinearTransition.springify().damping(16)}
            >
              <WordTile
                word={step.tiles[tileIndex]}
                look={answerLook}
                disabled={checked}
                onPress={() => removeTile(tileIndex)}
              />
            </Animated.View>
          ))}
        </View>
      </View>

      {/* Réserve : chaque tuile garde sa place ; une fois posée, il reste un emplacement vide */}
      <View className="flex-row flex-wrap justify-center gap-2">
        {step.tiles.map((word, tileIndex) => {
          const isPlaced = placed.includes(tileIndex);
          return (
            <View key={tileIndex}>
              {isPlaced ? (
                // Emplacement vide de la même taille : le mot est invisible mais garde la largeur
                <View className="h-12 justify-center rounded-xl bg-disabled px-4">
                  <Text className="font-title text-lg opacity-0">{word}</Text>
                </View>
              ) : (
                <Animated.View entering={ZoomIn.duration(180)}>
                  <WordTile word={word} look="bank" disabled={checked} onPress={() => addTile(tileIndex)} />
                </Animated.View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Une tuile de mot
// ---------------------------------------------------------------------------

type TileLook = "bank" | "answer" | "correct" | "wrong";

// Classes de chaque apparence (écrites EN ENTIER pour Tailwind)
const TILE_CLASSES: Record<TileLook, { card: string; text: string }> = {
  bank: { card: "border-sand bg-white", text: "text-ink" },
  answer: { card: "border-green bg-green-light", text: "text-green-dark" },
  correct: { card: "border-green bg-green-light", text: "text-green-dark" },
  wrong: { card: "border-red bg-red-light", text: "text-red-shadow" },
};

type WordTileProps = {
  word: string;
  look: TileLook;
  disabled: boolean;
  onPress: () => void;
};

function WordTile({ word, look, disabled, onPress }: WordTileProps) {
  const classes = TILE_CLASSES[look];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={look === "bank" ? `Ajouter « ${word} »` : `Retirer « ${word} »`}
      className={`h-12 justify-center rounded-xl border-2 border-b-[5px] px-4 active:mt-[3px] active:border-b-2 ${classes.card}`}
    >
      <Text className={`font-title text-lg ${classes.text}`}>{word}</Text>
    </Pressable>
  );
}
