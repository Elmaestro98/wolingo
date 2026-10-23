import { buildModuleQuiz, findModuleOfItem, isExerciseStep, QUIZ_QUESTION_COUNT } from "@/lib/quiz";

describe("Grand quiz du module", () => {
  it("se construit à partir de l'id du quiz", () => {
    const quiz = buildModuleQuiz("u1-quiz");
    expect(quiz).toBeDefined();
    expect(quiz?.id).toBe("u1-quiz");
  });

  it(`contient ${QUIZ_QUESTION_COUNT} questions, uniquement des exercices`, () => {
    const quiz = buildModuleQuiz("u1-quiz");
    expect(quiz?.steps).toHaveLength(QUIZ_QUESTION_COUNT);
    expect(quiz?.steps.every(isExerciseStep)).toBe(true);
  });

  it("n'apporte pas de nouveaux mots (c'est une révision)", () => {
    expect(buildModuleQuiz("u1-quiz")?.newWords).toEqual([]);
  });

  it("refuse un id qui n'est pas un quiz", () => {
    expect(buildModuleQuiz("u1-l3")).toBeUndefined(); // une leçon
    expect(buildModuleQuiz("inconnu")).toBeUndefined();
  });

  it("retrouve le module d'une étape", () => {
    expect(findModuleOfItem("u1-l4")?.id).toBe("u1");
    expect(findModuleOfItem("inconnu")).toBeUndefined();
  });
});
