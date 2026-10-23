import { LESSONS, type LessonStep } from "@/content/lessons";
import { deremToCfa } from "@/lib/derem";

/**
 * Vérifie la cohérence de TOUT le contenu pédagogique.
 * Chaque nouvelle leçon ajoutée dans lessons.ts est contrôlée automatiquement.
 */

/** Renvoie la liste des problèmes d'une étape (liste vide = tout va bien). */
function findStepProblems(step: LessonStep): string[] {
  const problems: string[] = [];

  switch (step.type) {
    case "multiple_choice":
    case "fill_blank":
      if (step.answerIndex < 0 || step.answerIndex >= step.choices.length) {
        problems.push("answerIndex pointe en dehors des choix");
      }
      if (new Set(step.choices).size !== step.choices.length) {
        problems.push("deux choix identiques");
      }
      break;
    case "build_sentence":
      for (const word of step.answer) {
        if (!step.tiles.includes(word)) problems.push(`le mot « ${word} » de la réponse manque dans les tuiles`);
      }
      break;
    case "match_pairs": {
      const articles = step.pairs.map((pair) => pair.article);
      if (new Set(articles).size !== articles.length) problems.push("deux paires ont le même article");
      break;
    }
    case "derem": {
      const goodChoices = step.choices.filter((choice) => deremToCfa(choice.derem) === step.priceCfa);
      if (goodChoices.length !== 1) problems.push(`${goodChoices.length} bonne(s) réponse(s) au lieu d'une seule`);
      break;
    }
    case "write_translation":
      if (step.acceptedAnswers.length === 0) problems.push("aucune réponse acceptée");
      break;
    case "lesson_card":
      if (step.blocks.length === 0) problems.push("fiche sans aucun bloc");
      for (const block of step.blocks) {
        if (block.type === "noun_examples") {
          for (const noun of block.nouns) {
            if (noun.classLetter.length !== 1) {
              problems.push(`« ${noun.noun} » : la consonne de classe doit être une seule lettre`);
            }
          }
        }
        if (block.type === "conjugation" && block.rows.length === 0) problems.push("tableau de conjugaison vide");
        if (block.type === "rule" && block.tiles.length === 0) problems.push("règle sans aucune case");
        if (block.type === "article_forms") {
          const articles = block.forms.map((form) => form.article);
          if (articles.length === 0) problems.push(`aucun article pour « ${block.word} »`);
          if (new Set(articles).size !== articles.length) problems.push(`article en double pour « ${block.word} »`);
        }
      }
      break;
  }
  return problems;
}

// Object.entries : la liste des couples [id, leçon]
describe.each(Object.entries(LESSONS))("leçon %s", (id, lesson) => {
  it("a le même id que sa clé dans LESSONS", () => {
    expect(lesson.id).toBe(id);
  });

  it("a au moins une étape et au moins un nouveau mot", () => {
    expect(lesson.steps.length).toBeGreaterThan(0);
    expect(lesson.newWords.length).toBeGreaterThan(0);
  });

  it("n'a aucune étape incohérente", () => {
    // Pour chaque étape fautive : « étape 3 (derem) : 2 bonne(s) réponse(s)… »
    const problems = lesson.steps.flatMap((step, index) =>
      findStepProblems(step).map((problem) => `étape ${index + 1} (${step.type}) : ${problem}`),
    );
    expect(problems).toEqual([]);
  });
});
