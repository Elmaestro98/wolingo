import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import type { ArticleDistance, ArticleForm } from "@/content/lessons";

type ArticleFormsBlockProps = {
  title: string;
  text: string;
  word: string;
  forms: ArticleForm[];
  pluralNote?: string;
};

/**
 * Le contenu dit le SENS (« near », « far »…) ; c'est ICI qu'on choisit l'icône qui le représente.
 * Changer d'icône ne demande donc de modifier aucune leçon.
 */
const DISTANCE_ICONS: Record<ArticleDistance, ComponentProps<typeof Ionicons>["name"]> = {
  near: "location-outline",
  there: "arrow-forward",
  mentioned: "chatbubble-outline",
  far: "telescope-outline",
};

/** Bloc « les articles d'un mot » (maquette 09) : touche une ligne pour la mettre en valeur. */
export function ArticleFormsBlock({ title, text, word, forms, pluralNote }: ArticleFormsBlockProps) {
  // La ligne mise en valeur (la première au départ)
  const [selectedArticle, setSelectedArticle] = useState(forms[0]?.article);

  return (
    <View className="gap-3">
      <View className="gap-1">
        <Text className="font-title text-xl text-ink">{title}</Text>
        <Text className="font-body text-sm leading-5 text-muted">{text}</Text>
      </View>

      {forms.map((form) => {
        const isSelected = form.article === selectedArticle;
        return (
          <Pressable
            key={form.article}
            // Plus tard : jouer aussi l'audio de « kër gi »…
            onPress={() => setSelectedArticle(form.article)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            className={`flex-row items-center gap-3 rounded-[18px] border-2 p-3 ${
              isSelected ? "border-green bg-green-light" : "border-transparent bg-white"
            }`}
          >
            <View
              className={`h-11 w-11 items-center justify-center rounded-full ${isSelected ? "bg-green" : "bg-[#F3EEE5]"}`}
            >
              <Ionicons
                name={DISTANCE_ICONS[form.distance]}
                size={18}
                color={isSelected ? Colors.white : "#3D3730"}
              />
            </View>
            <View className="flex-1">
              <View className="flex-row flex-wrap items-center gap-2">
                <Text className="font-title text-lg text-ink">
                  {word} <Text className="text-green">{form.article}</Text>
                </Text>
                <View className={`rounded-full px-2 py-0.5 ${isSelected ? "bg-green" : "bg-[#F3EEE5]"}`}>
                  <Text
                    className={`font-body-black text-[11px] ${isSelected ? "text-white" : "text-[#3D3730]"}`}
                  >
                    {form.label}
                  </Text>
                </View>
              </View>
              <Text className="font-body text-[13px] text-muted">{form.french}</Text>
            </View>
          </Pressable>
        );
      })}

      {pluralNote && <Text className="font-body text-[13px] italic text-muted">{pluralNote}</Text>}
    </View>
  );
}
