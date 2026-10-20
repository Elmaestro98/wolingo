import { Text, View } from "react-native";

import type { Example } from "@/content/lessons";

type ExplanationStepProps = {
  eyebrow: string;
  title: string;
  text: string;
  examples: Example[];
};

/**
 * Étape « explication » : une règle + des exemples.
 * Version simple pour faire tourner le lecteur ; les fiches riches (écrans 06, 07, 09) viendront ensuite.
 */
export function ExplanationStep({ eyebrow, title, text, examples }: ExplanationStepProps) {
  return (
    <View className="gap-4">
      <View className="gap-1.5">
        <Text className="font-body-black text-xs uppercase tracking-[1.5px] text-yellow-text">{eyebrow}</Text>
        <Text className="font-title text-[30px] leading-[33px] text-ink">{title}</Text>
      </View>

      <Text className="font-body text-base leading-6 text-muted">{text}</Text>

      {/* Une carte par exemple */}
      <View className="gap-3">
        {examples.map((example) => (
          <View key={example.wolof} className="gap-0.5 rounded-[18px] border-2 border-sand bg-white px-4 py-3.5">
            <Text className="font-title text-2xl text-green">{example.wolof}</Text>
            <Text className="font-body text-sm text-muted">{example.french}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
