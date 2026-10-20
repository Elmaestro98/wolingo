import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

import { Colors } from "@/constants/theme";

type SpeechBubbleProps = {
  /** Phrase en gras (souvent en wolof) */
  title: string;
  /** Traduction ou précision en dessous, en gris */
  subtitle: string;
  /** Si fournie : affiche un bouton haut-parleur qui l'appelle. Sinon : pas de bouton. */
  onPlay?: () => void;
  /** Classes de position (ex. « absolute right-0 top-1.5 »), choisies par l'écran */
  className?: string;
};

/** Bulle de dialogue (Accueil, Parcours…), avec un bouton audio facultatif. */
export function SpeechBubble({ title, subtitle, onPlay, className = "" }: SpeechBubbleProps) {
  return (
    // Coins arrondis à 18px, sauf en bas à gauche (4px) : c'est la "pointe" de la bulle
    <View
      className={`flex-row items-center gap-2 rounded-[18px] rounded-bl-[4px] bg-white py-2 pl-3.5 shadow-md ${
        onPlay ? "pr-2" : "pr-3.5"
      } ${className}`}
    >
      {/* flex-shrink : le texte peut aller à la ligne si la bulle est étroite */}
      <View className="shrink">
        <Text className="font-title text-base leading-[18px] text-ink">{title}</Text>
        <Text className="font-body text-xs text-muted">{subtitle}</Text>
      </View>

      {onPlay && (
        <Pressable
          onPress={onPlay}
          accessibilityRole="button"
          accessibilityLabel="Écouter la prononciation"
          className="h-9 w-9 items-center justify-center rounded-full bg-green active:opacity-70"
        >
          <Ionicons name="volume-high-outline" size={18} color={Colors.white} />
        </Pressable>
      )}
    </View>
  );
}
