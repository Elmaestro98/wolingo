import Ionicons from "@expo/vector-icons/Ionicons";
import { useRef } from "react";
import { Pressable } from "react-native";

import { Colors } from "@/constants/theme";
import { hasWolofAudio, playWolof } from "@/services/wolof-voice";

/** Les 3 looks du bouton, repris des maquettes. */
const VARIANTS = {
  /** Gros bouton vert en relief (QCM, phrase à compléter) */
  large: {
    className:
      "h-[52px] w-[52px] items-center justify-center rounded-2xl border-b-4 border-green-shadow bg-green active:mt-1 active:border-b-0",
    iconSize: 24,
    iconColor: Colors.white,
  },
  /** Rond blanc (cartes sur fond sable, ex. « Leçon terminée ») */
  small: {
    className: "h-9 w-9 items-center justify-center rounded-full bg-white active:opacity-70",
    iconSize: 16,
    iconColor: Colors.green,
  },
  /** Petit rond vert clair (cartes blanches des fiches) */
  mini: {
    className: "h-8 w-8 items-center justify-center rounded-full bg-green-light active:opacity-70",
    iconSize: 16,
    iconColor: Colors.green,
  },
};

type SpeakButtonProps = {
  /** Le texte wolof à faire écouter (doit correspondre exactement au texte de la leçon) */
  text: string;
  variant?: keyof typeof VARIANTS;
};

/**
 * Bouton 🔊 : joue la voix d'un texte wolof.
 * 1er appui = vitesse normale, 2e appui = lentement, 3e = normal… (comme sur Duolingo).
 * Si l'enregistrement n'existe pas encore, le bouton n'apparaît pas du tout.
 */
export function SpeakButton({ text, variant = "small" }: SpeakButtonProps) {
  // useRef : un compteur qui survit aux affichages SANS en provoquer de nouveaux
  const pressCount = useRef(0);

  if (!hasWolofAudio(text)) return null;

  const look = VARIANTS[variant];

  function handlePress() {
    const slow = pressCount.current % 2 === 1; // un appui sur deux : lent
    pressCount.current += 1;
    playWolof(text, { slow });
  }

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Écouter « ${text} »`}
      accessibilityHint="Touche encore pour l'écouter lentement"
      hitSlop={8}
      className={look.className}
    >
      <Ionicons name="volume-high-outline" size={look.iconSize} color={look.iconColor} />
    </Pressable>
  );
}
