import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, Pressable, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { CONTENT_IMAGES, type ContentImageName } from "@/content/images";
import type { WordTag } from "@/content/lessons";

type WordHeaderBlockProps = {
  image: ContentImageName;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  translation: string;
  definition: string;
  tags: WordTag[];
  culturalNote?: string;
};

/** En-tête de la fiche mot (maquette 09) : grande photo, le mot, sa traduction, ses étiquettes. */
export function WordHeaderBlock({
  image,
  word,
  phonetic,
  partOfSpeech,
  translation,
  definition,
  tags,
  culturalNote,
}: WordHeaderBlockProps) {
  return (
    <View className="overflow-hidden rounded-[22px] bg-white">
      {/* La photo, avec le badge « Nouveau mot » posé par-dessus (absolute) */}
      <View>
        <Image source={CONTENT_IMAGES[image]} className="h-[170px] w-full" resizeMode="cover" />
        <View className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1">
          <Text className="font-body-black text-[11px] uppercase tracking-[1px] text-ink">Nouveau mot</Text>
        </View>
      </View>

      <View className="gap-3 p-4">
        {/* Le mot + les boutons d'écoute */}
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="font-title text-[44px] leading-[48px] text-ink">{word}</Text>
            <Text className="font-body text-[13px] text-muted">
              [{phonetic}] · {partOfSpeech}
            </Text>
          </View>
          <View className="flex-row gap-2">
            <Pressable
              // Plus tard : lecture lente avec expo-audio
              onPress={() => {}}
              accessibilityRole="button"
              accessibilityLabel="Écouter lentement"
              className="h-[52px] w-[52px] items-center justify-center rounded-2xl bg-green-light"
            >
              <Ionicons name="hourglass-outline" size={20} color={Colors.green} />
            </Pressable>
            <Pressable
              // Plus tard : lecture normale avec expo-audio
              onPress={() => {}}
              accessibilityRole="button"
              accessibilityLabel={`Écouter « ${word} »`}
              className="h-[52px] w-[52px] items-center justify-center rounded-2xl border-b-4 border-green-shadow bg-green"
            >
              <Ionicons name="volume-high-outline" size={22} color={Colors.white} />
            </Pressable>
          </View>
        </View>

        <View>
          <Text className="font-title text-2xl text-green">{translation}</Text>
          <Text className="font-body text-sm text-muted">{definition}</Text>
        </View>

        {/* Les étiquettes : elles passent à la ligne si besoin (flex-wrap) */}
        <View className="flex-row flex-wrap gap-2">
          {tags.map((tag) => (
            <View
              key={tag.label}
              className={`rounded-full px-2.5 py-1 ${tag.highlight ? "bg-green-light" : "bg-[#F3EEE5]"}`}
            >
              <Text className={`font-body-black text-xs ${tag.highlight ? "text-green" : "text-[#3D3730]"}`}>
                {tag.label}
              </Text>
            </View>
          ))}
        </View>

        {culturalNote && (
          <View className="flex-row gap-2.5 rounded-2xl bg-yellow-light p-3">
            <Ionicons name="home-outline" size={18} color={Colors.yellowText} />
            <Text className="flex-1 font-body text-[13.5px] leading-5 text-[#5A4300]">{culturalNote}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
