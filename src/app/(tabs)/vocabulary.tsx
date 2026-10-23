import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, SectionList, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors, Fonts } from "@/constants/theme";
import { LESSONS } from "@/content/lessons";
import { MODULES } from "@/content/modules";
import { collectVocabulary, filterVocabulary, type VocabularyEntry } from "@/lib/vocabulary";
import { useProgressStore } from "@/stores/progress-store";

// La banque de mots ne dépend que du contenu : calculée UNE fois, en dehors du composant
const ALL_WORDS = collectVocabulary(MODULES, LESSONS);

/** Une section de la liste : une leçon et ses mots. */
type VocabularySection = {
  title: string;
  moduleNumber: number;
  isLearned: boolean;
  data: VocabularyEntry[];
};

/** Regroupe les mots par leçon, dans l'ordre (SectionList attend une liste de sections avec `data`). */
function groupByLesson(
  entries: VocabularyEntry[],
  completedLessons: Record<string, number>,
): VocabularySection[] {
  const sections: VocabularySection[] = [];
  for (const entry of entries) {
    const last = sections[sections.length - 1];
    if (last && last.data[0].lessonId === entry.lessonId) {
      last.data.push(entry); // même leçon que le mot précédent → même section
    } else {
      sections.push({
        title: entry.lessonTitle,
        moduleNumber: entry.moduleNumber,
        isLearned: entry.lessonId in completedLessons,
        data: [entry],
      });
    }
  }
  return sections;
}

/** Onglet « Lexique » : la banque de tous les mots, avec une recherche. */
export default function VocabularyScreen() {
  const [query, setQuery] = useState("");
  const completedLessons = useProgressStore((state) => state.completedLessons);

  const learnedCount = ALL_WORDS.filter((entry) => entry.lessonId in completedLessons).length;
  const sections = groupByLesson(filterVocabulary(ALL_WORDS, query), completedLessons);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-cream">
      {/* En-tête fixe : titre, compteur, recherche */}
      <View className="gap-3 px-6 pb-3 pt-3.5">
        <View>
          <Text className="font-body-black text-[11.5px] uppercase tracking-[1.6px] text-yellow-text">
            Wolingo
          </Text>
          <Text className="font-title text-[26px] leading-[29px] text-ink">Lexique</Text>
          <Text className="font-body text-sm text-muted">
            <Text className="font-body-black text-green">{learnedCount}</Text> mots appris sur{" "}
            {ALL_WORDS.length}
          </Text>
        </View>

        <View className="h-12 flex-row items-center gap-2 rounded-2xl border-2 border-sand bg-white px-3.5">
          <Ionicons name="search" size={18} color={Colors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Chercher un mot, en wolof ou en français…"
            placeholderTextColor="#8C8274"
            autoCorrect={false}
            autoCapitalize="none"
            accessibilityLabel="Chercher un mot"
            className="flex-1 text-base text-ink"
            style={{ fontFamily: Fonts.bodyBold }}
          />
          {query.length > 0 && (
            <Pressable
              onPress={() => setQuery("")}
              accessibilityRole="button"
              accessibilityLabel="Effacer la recherche"
            >
              <Ionicons name="close-circle" size={20} color={Colors.muted} />
            </Pressable>
          )}
        </View>
      </View>

      {/* SectionList : une liste longue en sections. Elle n'affiche que ce qui est visible → rapide. */}
      <SectionList
        sections={sections}
        keyExtractor={(entry) => entry.wolof}
        stickySectionHeadersEnabled // les titres de leçon restent collés en haut pendant le défilement
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag" // le clavier se ferme quand on fait défiler
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        renderSectionHeader={({ section }) => (
          <View className="flex-row items-center gap-2 bg-cream pb-2 pt-4">
            {!section.isLearned && <Ionicons name="lock-closed" size={12} color={Colors.muted} />}
            <Text className="font-body-black text-xs uppercase tracking-[1.3px] text-muted">
              {section.title} · Module {section.moduleNumber}
            </Text>
          </View>
        )}
        renderItem={({ item, section }) => <WordRow entry={item} isLearned={section.isLearned} />}
        ListEmptyComponent={
          <Text className="mt-10 text-center font-body text-base text-muted">
            Aucun mot ne correspond à « {query} ».
          </Text>
        }
      />
    </SafeAreaView>
  );
}

/** Une ligne de mot : le wolof à gauche, le français à droite. Grisé si la leçon n'est pas encore faite. */
function WordRow({ entry, isLearned }: { entry: VocabularyEntry; isLearned: boolean }) {
  return (
    <View
      className={`mb-2 flex-row items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 ${
        isLearned ? "" : "opacity-50"
      }`}
    >
      <Text className={`shrink font-title text-lg ${isLearned ? "text-green" : "text-ink"}`}>
        {entry.wolof}
      </Text>
      <Text className="shrink text-right font-body text-sm text-muted">{entry.french}</Text>
    </View>
  );
}
