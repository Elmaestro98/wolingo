import type { Lesson } from "@/content/lessons";
import type { Module } from "@/content/modules";
import { normalizeAnswer, removeAccents } from "@/lib/answer-checker";

/** Un mot de la banque de mots, avec la leçon où on l'apprend. */
export type VocabularyEntry = {
  wolof: string;
  french: string;
  lessonId: string;
  lessonTitle: string;
  moduleNumber: number;
};

/**
 * Rassemble tous les mots des leçons, dans l'ordre du Parcours (module 1 leçon 1, leçon 2…).
 * Sources : les « nouveaux mots », les blocs « mots de la même famille » et les fiches mot.
 * Un mot déjà vu dans une leçon précédente n'est pas répété (on garde la 1re leçon où il apparaît).
 */
export function collectVocabulary(modules: Module[], lessons: Record<string, Lesson>): VocabularyEntry[] {
  const entries: VocabularyEntry[] = [];
  // Set : une « boîte » qui ne garde chaque valeur qu'une seule fois → parfait pour repérer les doublons
  const alreadySeen = new Set<string>();

  for (const moduleData of modules) {
    for (const item of moduleData.items) {
      const lesson = lessons[item.id];
      if (item.kind !== "lesson" || !lesson) continue; // continue : passe directement à l'étape suivante

      const add = (wolof: string, french: string) => {
        const key = normalizeAnswer(wolof);
        if (alreadySeen.has(key)) return;
        alreadySeen.add(key);
        entries.push({
          wolof,
          french,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          moduleNumber: moduleData.number,
        });
      };

      for (const word of lesson.newWords) add(word.wolof, word.french);
      for (const step of lesson.steps) {
        if (step.type !== "lesson_card") continue;
        for (const block of step.blocks) {
          if (block.type === "related_words") for (const word of block.words) add(word.wolof, word.french);
          if (block.type === "word_header") add(block.word, block.translation);
        }
      }
    }
  }
  return entries;
}

/** Simplifie un texte pour la recherche : minuscules, sans ponctuation, sans accents (« Jërëjëf » → « jerejef »). */
function simplify(text: string): string {
  return removeAccents(normalizeAnswer(text));
}

/** Garde les mots dont le wolof OU le français contient la recherche (accents et majuscules ignorés). */
export function filterVocabulary(entries: VocabularyEntry[], query: string): VocabularyEntry[] {
  const search = simplify(query);
  if (search === "") return entries;
  return entries.filter(
    (entry) => simplify(entry.wolof).includes(search) || simplify(entry.french).includes(search),
  );
}
