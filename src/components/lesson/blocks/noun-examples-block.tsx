import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { CONTENT_IMAGES } from "@/content/images";
import type { NounExample } from "@/content/lessons";

type NounExamplesBlockProps = {
  title: string;
  nouns: NounExample[];
};

/**
 * Bloc « exemples du quotidien » (maquette 06) : des noms illustrés + un bouton Ici / Là-bas.
 * L'article n'est PAS stocké : il est fabriqué = consonne de classe + « i » (ici) ou « a » (là-bas).
 */
export function NounExamplesBlock({ title, nouns }: NounExamplesBlockProps) {
  const [isFar, setIsFar] = useState(false);

  return (
    <View className="gap-3">
      {/* Titre + bouton à deux positions */}
      <View className="flex-row items-center justify-between">
        <Text className="font-body-black text-xs uppercase tracking-[1.4px] text-muted">{title}</Text>
        <View className="flex-row rounded-full bg-sand p-1">
          <DistancePill label="Ici" isActive={!isFar} onPress={() => setIsFar(false)} />
          <DistancePill label="Là-bas" isActive={isFar} onPress={() => setIsFar(true)} />
        </View>
      </View>

      {nouns.map((noun) => {
        // L'article est CALCULÉ : « b » + « i » = « bi » ; « b » + « a » = « ba »
        const article = noun.classLetter + (isFar ? "a" : "i");
        return (
          <View key={noun.noun} className="flex-row items-center gap-3 rounded-[18px] bg-white p-3">
            <Image source={CONTENT_IMAGES[noun.image]} className="h-16 w-16 rounded-xl" />
            <View className="flex-1 gap-0.5">
              <View className="flex-row flex-wrap items-center gap-2">
                <Text className="font-title text-[22px] text-ink">
                  {noun.noun} <Text className={isFar ? "text-yellow-text" : "text-green"}>{article}</Text>
                </Text>
                <View className="rounded-full bg-[#F3EEE5] px-2 py-0.5">
                  <Text className="font-body-black text-[11px] text-[#3D3730]">
                    Classe {noun.classLetter.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text className="font-body text-[13px] text-muted">{isFar ? noun.far : noun.near}</Text>
            </View>
            <Pressable
              // Plus tard : jouer l'audio avec expo-audio
              onPress={() => {}}
              accessibilityRole="button"
              accessibilityLabel={`Écouter « ${noun.noun} ${article} »`}
              className="h-11 w-11 items-center justify-center rounded-full bg-green-light"
            >
              <Ionicons name="volume-high-outline" size={18} color={Colors.green} />
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

function DistancePill({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      className={`h-8 justify-center rounded-full px-3.5 ${isActive ? "bg-white" : ""}`}
    >
      <Text className={`font-body-black text-[13px] ${isActive ? "text-ink" : "text-muted"}`}>{label}</Text>
    </Pressable>
  );
}
