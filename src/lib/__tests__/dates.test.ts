import { getDisplayedStreak, getStreakAfterLesson, getYesterdayKey, toDateKey } from "@/lib/dates";

// new Date(année, mois, jour) : attention, les mois commencent à 0 (9 = octobre)
const OCT_20 = new Date(2026, 9, 20);

describe("toDateKey / getYesterdayKey", () => {
  it("écrit une date au format AAAA-MM-JJ", () => {
    expect(toDateKey(OCT_20)).toBe("2026-10-20");
  });

  it("gère le changement de mois", () => {
    expect(getYesterdayKey(new Date(2026, 10, 1))).toBe("2026-10-31");
  });

  it("gère le changement d'année", () => {
    expect(getYesterdayKey(new Date(2027, 0, 1))).toBe("2026-12-31");
  });
});

describe("getStreakAfterLesson (série après une leçon)", () => {
  it("ne change pas pour une 2e leçon le même jour", () => {
    expect(getStreakAfterLesson(5, "2026-10-20", OCT_20)).toBe(5);
  });

  it("augmente de 1 si la dernière leçon date d'hier", () => {
    expect(getStreakAfterLesson(5, "2026-10-19", OCT_20)).toBe(6);
  });

  it("repart à 1 après un jour sauté", () => {
    expect(getStreakAfterLesson(5, "2026-10-17", OCT_20)).toBe(1);
  });

  it("vaut 1 pour la toute première leçon", () => {
    expect(getStreakAfterLesson(0, null, OCT_20)).toBe(1);
  });
});

describe("getDisplayedStreak (série affichée)", () => {
  it("affiche 0 si la série est cassée", () => {
    expect(getDisplayedStreak(5, "2026-10-17", OCT_20)).toBe(0);
  });

  it("garde la série si la dernière leçon date d'hier", () => {
    expect(getDisplayedStreak(5, "2026-10-19", OCT_20)).toBe(5);
  });
});
