import type { ReactNode } from "react";
import { Image, Text, View, type ImageSourcePropType } from "react-native";

type MascotTipProps = {
  /** Phrase en gras : un simple texte, ou du JSX pour mélanger plusieurs styles */
  title: ReactNode;
  /** Explication en dessous */
  text: string;
  /** Portrait affiché à gauche (la mascotte par défaut) */
  image?: ImageSourcePropType;
};

/** Encadré jaune « conseil de la mascotte » (écrans 02 et 04). */
export function MascotTip({ title, text, image = require("@/assets/images/mascot.png") }: MascotTipProps) {
  return (
    <View className="flex-row items-start gap-3 rounded-2xl bg-yellow-light p-3.5">
      <Image source={image} className="h-11 w-11 rounded-full border-2 border-white" />
      {/* flex-1 : sans lui, le texte déborderait de l'écran au lieu d'aller à la ligne */}
      <View className="flex-1 gap-0.5">
        <Text className="font-body-black text-sm text-[#3A2A00]">{title}</Text>
        <Text className="font-body text-[13px] leading-[18px] text-[#5A4300]">{text}</Text>
      </View>
    </View>
  );
}
