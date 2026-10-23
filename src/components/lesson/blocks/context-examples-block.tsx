import { Text, View } from "react-native";

import type { ContextExample } from "@/content/lessons";

type ContextExamplesBlockProps = {
  title: string;
  examples: ContextExample[];
};

/** Bloc « en contexte » (maquette 09) : des phrases complètes qui utilisent le mot. */
export function ContextExamplesBlock({ title, examples }: ContextExamplesBlockProps) {
  return (
    <View className="gap-3">
      <Text className="font-title text-xl text-ink">{title}</Text>
      {examples.map((example) => (
        // Trait vert à gauche (border-l) : style « citation »
        <View key={example.wolof} className="gap-1 rounded-r-2xl border-l-4 border-green bg-white px-4 py-3">
          <Text className="font-title text-lg text-ink">{example.wolof}</Text>
          <Text className="font-body text-sm italic text-muted">{example.french}</Text>
          {example.note && <Text className="mt-1 font-body-bold text-xs text-green">{example.note}</Text>}
        </View>
      ))}
    </View>
  );
}
