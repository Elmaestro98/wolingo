import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import type { MatchPairsStepData } from "@/content/lessons";

type MatchPairsStepProps = {
  step: MatchPairsStepData;
  /** true quand toutes les paires sont trouvées (le lecteur affiche la correction) */
  checked: boolean;
  /** Prévient le lecteur quand l'exercice est terminé */
  onAnswerChange: (isCorrect: boolean) => void;
  /** Prévient le lecteur à chaque mauvaise paire (il retire une vie) */
  onMistake: () => void;
};

/** Mélange une liste au hasard (algorithme de Fisher-Yates). Renvoie une NOUVELLE liste. */
function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]; // échange les deux éléments
  }
  return result;
}

/**
 * Exercice « associer » (écran 11) : toucher un nom, puis son article.
 * Chaque paire est vérifiée tout de suite ; l'exercice se termine tout seul quand tout est trouvé.
 * Les paires sont repérées par leur position dans `step.pairs` (0, 1, 2, 3).
 */
export function MatchPairsStep({ step, checked, onAnswerChange, onMistake }: MatchPairsStepProps) {
  // Le nom sélectionné (en attente de son article)
  const [selectedNoun, setSelectedNoun] = useState<number | null>(null);
  // Les paires déjà trouvées
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  // La dernière erreur, pour l'afficher en rouge
  const [wrongAttempt, setWrongAttempt] = useState<{ noun: number; article: number } | null>(null);
  // Ordre des articles dans la colonne de droite, mélangé UNE SEULE FOIS à l'ouverture
  // (la fonction passée à useState n'est exécutée qu'au tout premier affichage)
  const [articleOrder] = useState(() => shuffle(step.pairs.map((_, index) => index)));

  const totalPairs = step.pairs.length;

  function handleNounPress(pairIndex: number) {
    setSelectedNoun(pairIndex);
    setWrongAttempt(null);
  }

  function handleArticlePress(pairIndex: number) {
    if (selectedNoun === null) return; // il faut d'abord choisir un nom

    if (pairIndex === selectedNoun) {
      // Bonne paire : on l'ajoute à la liste (NOUVELLE liste, jamais .push)
      const newMatched = [...matchedPairs, pairIndex];
      setMatchedPairs(newMatched);
      setSelectedNoun(null);
      if (newMatched.length === totalPairs) {
        onAnswerChange(true); // tout est trouvé → le lecteur affiche la correction
      }
    } else {
      // Mauvaise paire : on la montre en rouge et on prévient le lecteur
      setWrongAttempt({ noun: selectedNoun, article: pairIndex });
      setSelectedNoun(null);
      onMistake();
    }
  }

  // Message sous les colonnes, calculé selon la situation
  let statusText = `${matchedPairs.length} paire${matchedPairs.length > 1 ? "s" : ""} sur ${totalPairs}`;
  let statusColor = "text-muted";
  if (wrongAttempt) {
    statusText = "Pas la bonne paire, réessaie";
    statusColor = "text-[#B42318]";
  } else if (selectedNoun !== null) {
    statusText = "Choisis maintenant l'article";
    statusColor = "text-yellow-text";
  }

  return (
    <View className="gap-[18px]">
      {/* Consigne */}
      <View className="gap-1">
        <Text className="font-body-black text-xs uppercase tracking-[1.7px] text-yellow-text">{step.eyebrow}</Text>
        <Text className="font-title text-2xl text-ink">{step.question}</Text>
        <Text className="font-body text-sm text-muted">{step.instruction}</Text>
      </View>

      {/* Deux colonnes côte à côte */}
      <View className="flex-row gap-3">
        {/* Colonne de gauche : les noms, dans l'ordre du contenu */}
        <View className="flex-1 gap-2.5">
          {step.pairs.map((pair, pairIndex) => {
            const look = getTileLook({
              isMatched: matchedPairs.includes(pairIndex),
              isSelected: selectedNoun === pairIndex,
              isWrong: wrongAttempt?.noun === pairIndex,
            });
            return (
              <Tile key={pair.wolof} look={look} onPress={() => handleNounPress(pairIndex)} disabled={checked}>
                <View className="shrink">
                  <Text className={`font-title text-[22px] ${TILE_TEXT[look]}`}>{pair.wolof}</Text>
                  <Text className={`font-body-medium text-[13px] opacity-80 ${TILE_TEXT[look]}`}>{pair.french}</Text>
                </View>
              </Tile>
            );
          })}
        </View>

        {/* Colonne de droite : les articles, dans l'ordre mélangé */}
        <View className="flex-1 gap-2.5">
          {articleOrder.map((pairIndex) => {
            const look = getTileLook({
              isMatched: matchedPairs.includes(pairIndex),
              isSelected: false,
              isWrong: wrongAttempt?.article === pairIndex,
            });
            return (
              <Tile
                key={step.pairs[pairIndex].article}
                look={look}
                onPress={() => handleArticlePress(pairIndex)}
                disabled={checked}
              >
                <Text className={`font-title text-[26px] ${TILE_TEXT[look]}`}>{step.pairs[pairIndex].article}</Text>
              </Tile>
            );
          })}
        </View>
      </View>

      {/* Progression : un trait par paire + message */}
      <View className="flex-row items-center justify-center gap-2.5">
        <View className="flex-row gap-1.5">
          {step.pairs.map((pair, index) => (
            <View
              key={pair.wolof}
              className={`h-2 w-[22px] rounded-full ${index < matchedPairs.length ? "bg-green" : "bg-[#E2D9C9]"}`}
            />
          ))}
        </View>
        <Text accessibilityLiveRegion="polite" className={`font-body-black text-[13.5px] ${statusColor}`}>
          {statusText}
        </Text>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Une tuile (nom ou article)
// ---------------------------------------------------------------------------

type TileLook = "idle" | "selected" | "matched" | "wrong";

/** Déduit l'apparence d'une tuile. L'ordre compte : une paire trouvée reste verte quoi qu'il arrive. */
function getTileLook({ isMatched, isSelected, isWrong }: { isMatched: boolean; isSelected: boolean; isWrong: boolean }): TileLook {
  if (isMatched) return "matched";
  if (isWrong) return "wrong";
  if (isSelected) return "selected";
  return "idle";
}

// Classes de chaque apparence (écrites EN ENTIER pour Tailwind)
const TILE_CARD: Record<TileLook, string> = {
  idle: "border-2 border-b-[6px] border-sand bg-white",
  selected: "border-2 border-b-[6px] border-[#E0A800] bg-[#FFF6DA]",
  matched: "border-2 border-[#A9D3B8] bg-green-light opacity-75",
  wrong: "border-2 border-b-[6px] border-red bg-red-light",
};
const TILE_TEXT: Record<TileLook, string> = {
  idle: "text-ink",
  selected: "text-[#3A2A00]",
  matched: "text-green",
  wrong: "text-red-shadow",
};

type TileProps = {
  look: TileLook;
  onPress: () => void;
  disabled: boolean;
  children: React.ReactNode;
};

function Tile({ look, onPress, disabled, children }: TileProps) {
  const isMatched = look === "matched";

  return (
    <Pressable
      onPress={onPress}
      // Une tuile déjà associée ne réagit plus
      disabled={disabled || isMatched}
      accessibilityRole="button"
      accessibilityState={{ selected: look === "selected", disabled: disabled || isMatched }}
      className={`h-[72px] flex-row items-center justify-between gap-2 rounded-2xl pl-3.5 pr-3 ${TILE_CARD[look]}`}
    >
      {children}
      {isMatched && (
        <View className="h-[26px] w-[26px] items-center justify-center rounded-full bg-green">
          <Ionicons name="checkmark" size={14} color={Colors.white} />
        </View>
      )}
    </Pressable>
  );
}
