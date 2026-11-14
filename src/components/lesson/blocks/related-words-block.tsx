import { Text, View } from "react-native";

import { SpeakButton } from "@/components/speak-button";
import type { Example } from "@/content/lessons";

type RelatedWordsBlockProps = {
  title: string;
  words: Example[];
};

/** Bloc « mots de la même famille » (maquette 09) : des petites cartes qui passent à la ligne. */
export function RelatedWordsBlock({ title, words }: RelatedWordsBlockProps) {
  return (
    <View className="gap-3">
      <Text className="font-title text-xl text-ink">{title}</Text>
      <View className="flex-row flex-wrap gap-2">
        {words.map((word) => (
          <View key={word.wolof} className="flex-row items-center gap-2.5 rounded-2xl bg-white py-2.5 pl-3.5 pr-2.5">
            <View>
              <Text className="font-title text-base text-green">{word.wolof}</Text>
              <Text className="font-body text-xs text-muted">{word.french}</Text>
            </View>
            <SpeakButton text={word.wolof} variant="mini" />
          </View>
        ))}
      </View>
    </View>
  );
}
