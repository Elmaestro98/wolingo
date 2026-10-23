import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import type { ConjugationRow } from "@/content/lessons";

type ConjugationBlockProps = {
  title: string;
  rows: ConjugationRow[];
};

/** Bloc « conjugaison » (maquette 07) : un tableau Pronom | Forme wolof | Audio. */
export function ConjugationBlock({ title, rows }: ConjugationBlockProps) {
  return (
    <View className="gap-3">
      <Text className="font-body-black text-xs uppercase tracking-[1.4px] text-muted">{title}</Text>

      {/* overflow-hidden : les coins arrondis coupent aussi l'en-tête du tableau */}
      <View className="overflow-hidden rounded-[18px] bg-white">
        {/* En-tête du tableau */}
        <View className="flex-row bg-[#F3EEE5] px-3.5 py-2.5">
          <Text className="w-[36%] font-body-black text-[11.5px] uppercase tracking-[0.8px] text-muted">
            Pronom
          </Text>
          <Text className="flex-1 font-body-black text-[11.5px] uppercase tracking-[0.8px] text-muted">
            Forme wolof
          </Text>
        </View>

        {/* Une ligne par pronom ; un trait fin entre deux lignes (sauf avant la première) */}
        {rows.map((row, index) => (
          <View
            key={row.pronoun}
            className={`flex-row items-center px-3.5 py-3 ${index > 0 ? "border-t border-[#F0EADF]" : ""}`}
          >
            <View className="w-[36%]">
              <Text className="font-title text-lg text-ink">{row.pronoun}</Text>
              <Text className="font-body text-xs text-muted">{row.pronounFrench}</Text>
            </View>
            <View className="flex-1">
              {/* La racine en noir, la terminaison en vert souligné : on voit ce qui ne change pas */}
              <Text className="font-title text-xl text-ink">
                {row.stem}
                <Text className="text-green underline">{row.ending}</Text>
              </Text>
              <Text className="font-body text-xs text-muted">{row.french}</Text>
            </View>
            <Pressable
              // Plus tard : jouer l'audio avec expo-audio
              onPress={() => {}}
              accessibilityRole="button"
              accessibilityLabel={`Écouter « ${row.stem}${row.ending} »`}
              className="h-10 w-10 items-center justify-center rounded-full bg-green-light"
            >
              <Ionicons name="volume-high-outline" size={17} color={Colors.green} />
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}
