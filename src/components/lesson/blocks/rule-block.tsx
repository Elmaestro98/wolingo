import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import type { RuleTile } from "@/content/lessons";

type RuleBlockProps = {
  title: string;
  text?: string;
  tiles: RuleTile[];
};

// Classes de chaque couleur de case (écrites EN ENTIER pour Tailwind)
const TONE_CLASSES = {
  green: { card: "bg-green-light", formula: "text-green", meaning: "text-green" },
  yellow: { card: "bg-[#FCEFC7]", formula: "text-yellow-text", meaning: "text-yellow-text" },
};

/** Bloc « règle » (maquettes 06 et 07) : une ampoule, un titre, un texte, et des cases côte à côte. */
export function RuleBlock({ title, text, tiles }: RuleBlockProps) {
  return (
    <View className="gap-3 rounded-[20px] bg-white p-4">
      <View className="flex-row items-center gap-2.5">
        <View className="h-9 w-9 items-center justify-center rounded-full bg-yellow-light">
          <Ionicons name="bulb-outline" size={18} color={Colors.yellowText} />
        </View>
        <Text className="font-body-black text-base text-ink">{title}</Text>
      </View>

      {text && <Text className="font-body text-[15px] leading-[22px] text-[#3D3730]">{text}</Text>}

      {/* Les cases, côte à côte, de largeur égale (flex-1) */}
      <View className="flex-row gap-2.5">
        {tiles.map((tile) => {
          const tone = TONE_CLASSES[tile.tone];
          return (
            <View key={tile.formula} className={`flex-1 gap-0.5 rounded-2xl p-3 ${tone.card}`}>
              <Text className={`font-title text-xl ${tone.formula}`}>{tile.formula}</Text>
              <Text className={`font-body-bold text-xs ${tone.meaning}`}>{tile.meaning}</Text>
              {tile.example && (
                <View className="mt-2">
                  <Text className="font-body-black text-[15px] text-ink">{tile.example}</Text>
                  {tile.exampleTranslation && (
                    <Text className="font-body text-xs text-muted">{tile.exampleTranslation}</Text>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
