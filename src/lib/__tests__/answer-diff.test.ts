import { compareAnswerWords } from "@/lib/answer-diff";

/** Raccourci : la liste des mots marqués comme différents */
function differentWords(words: { text: string; isDifferent: boolean }[]) {
  return words.filter((word) => word.isDifferent).map((word) => word.text);
}

describe("compareAnswerWords (barrer / souligner les mots)", () => {
  it("repère le mot faux au milieu de la phrase (maquette 17)", () => {
    const { userWords, correctWords } = compareAnswerWords("Joob lekk dem", "Joob angiy dem");
    expect(differentWords(userWords)).toEqual(["lekk"]);
    expect(differentWords(correctWords)).toEqual(["angiy"]);
  });

  it("ignore majuscules et ponctuation", () => {
    const { userWords } = compareAnswerWords("joob angiy dem.", "Joob angiy dem");
    expect(differentWords(userWords)).toEqual([]);
  });

  it("souligne les mots manquants d'une réponse trop courte", () => {
    const { correctWords } = compareAnswerWords("Joob", "Joob angiy dem");
    expect(differentWords(correctWords)).toEqual(["angiy", "dem"]);
  });

  it("barre les mots en trop d'une réponse trop longue", () => {
    const { userWords } = compareAnswerWords("Joob angiy dem fi", "Joob angiy dem");
    expect(differentWords(userWords)).toEqual(["fi"]);
  });

  it("garde l'écriture d'origine pour l'affichage", () => {
    const { userWords } = compareAnswerWords("Mangi  fi !", "Mangi fale");
    expect(userWords.map((word) => word.text)).toEqual(["Mangi", "fi", "!"]);
  });
});
