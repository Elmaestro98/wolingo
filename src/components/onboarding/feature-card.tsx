
import {Text,View} from 'react-native'
import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";

export type IconName = ComponentProps<typeof Ionicons>["name"];

export type FeatureCardProps = {
  icon: IconName;
  iconColor: string;
  iconBackground: string;
  title: string;
  subtitle: string;
};


/** Petite carte « atout » de l'écran d'accueil (icône + titre + sous-titre). */
export function FeatureCard({ icon, iconColor, iconBackground, title, subtitle }: FeatureCardProps) {
  return (
    <View className="flex-1 items-center gap-2 rounded-2xl bg-white px-1.5 pb-3 pt-3.5">
      <View className={`h-10 w-10 items-center justify-center rounded-xl ${iconBackground}`}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <Text className="text-center font-body-black text-[13px] leading-4 text-ink">{title}</Text>
      <Text className="text-center font-body text-[11.5px] leading-4 text-muted">{subtitle}</Text>
    </View>
  );
}
