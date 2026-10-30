import { LESSONS } from "@/content/lessons";
import { MODULES } from "@/content/modules";
import { collectVocabulary, filterVocabulary } from "@/lib/vocabulary";

const VOCABULARY = collectVocabulary(MODULES, LESSONS);

describe("banque de mots (Lexique)", () => {
  it("commence par les mots de la 1re leçon du Parcours", () => {
    expect(VOCABULARY[0].lessonId).toBe("u1-l1");
  });

  it("ne répète jamais un mot", () => {
    const keys = VOCABULARY.map((entry) => entry.wolof.toLowerCase());
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("ne contient que des mots de leçons présentes sur le Parcours", () => {
    const pathLessonIds = MODULES.flatMap((moduleData) => moduleData.items.map((item) => item.id));
    expect(VOCABULARY.every((entry) => pathLessonIds.includes(entry.lessonId))).toBe(true);
  });

  it("trouve un mot en wolof, même sans les accents", () => {
    const results = filterVocabulary(VOCABULARY, "jerejef");
    expect(results.map((entry) => entry.wolof)).toContain("Jërëjëf");
  });

  it("trouve un mot par sa traduction française", () => {
    const results = filterVocabulary(VOCABULARY, "MAISON");
    expect(results.some((entry) => entry.wolof === "kër")).toBe(true);
  });

  it("renvoie tout quand la recherche est vide", () => {
    expect(filterVocabulary(VOCABULARY, "   ")).toHaveLength(VOCABULARY.length);
  });
});
