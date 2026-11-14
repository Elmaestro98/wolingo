import { getStepRef, REVIEW_SESSION_ID, scheduleAfterMistake } from "@/lib/review";
import { LESSONS } from "@/content/lessons";
import { getPracticeLessonId, isPracticeSession } from "@/lib/practice";

const NOV_14 = new Date(2026, 10, 14);
const NOV_15 = new Date(2026, 10, 15);

describe("séances de pratique", () => {
  it("reconnaît une leçon déjà terminée et la révision du jour", () => {
    expect(isPracticeSession("u1-l1", { "u1-l1": 3 })).toBe(true);
    expect(isPracticeSession(REVIEW_SESSION_ID, {})).toBe(true);
  });

  it("une nouvelle leçon n'est pas une pratique", () => {
    expect(isPracticeSession("u1-l2", { "u1-l1": 3 })).toBe(false);
  });
});

describe("séance proposée pour regagner une vie", () => {
  it("ne propose rien si aucune leçon n'est terminée", () => {
    expect(getPracticeLessonId({}, {}, NOV_14)).toBeUndefined();
  });

  it("propose la dernière leçon terminée (pas un Grand quiz)", () => {
    expect(getPracticeLessonId({ "u1-l1": 3, "u1-l2": 2, "u1-quiz": 3 }, {}, NOV_14)).toBe("u1-l2");
  });

  it("préfère la révision du jour quand des exercices sont à revoir", () => {
    const ref = getStepRef(LESSONS["u1-l3"].steps[1])!;
    // Raté le 14 → à revoir le 15
    const reviewItems = { [ref]: scheduleAfterMistake(NOV_14) };
    expect(getPracticeLessonId({ "u1-l1": 3 }, reviewItems, NOV_14)).toBe("u1-l1");
    expect(getPracticeLessonId({ "u1-l1": 3 }, reviewItems, NOV_15)).toBe(REVIEW_SESSION_ID);
  });
});
