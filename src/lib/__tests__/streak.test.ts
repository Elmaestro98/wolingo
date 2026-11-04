import { getStreakWeek, isFirstLessonOfDay } from "@/lib/streak";

// Rappel : les mois commencent à 0 (9 = octobre). Le 20/10/2026 est un mardi, le 22 un jeudi.
const TUESDAY = new Date(2026, 9, 20);
const THURSDAY = new Date(2026, 9, 22);
const SUNDAY = new Date(2026, 9, 25);
const MONDAY = new Date(2026, 9, 26);

/** Les jours cochés, en texte (plus lisible dans les tests) : ex. ["Ma", "Me", "Je"] */
function doneLabels(streakDays: number, today: Date): string[] {
  return getStreakWeek(streakDays, today)
    .filter((day) => day.isDone)
    .map((day) => day.label);
}

describe("isFirstLessonOfDay", () => {
  it("est vrai pour la toute première leçon, ou si la dernière date d'un autre jour", () => {
    expect(isFirstLessonOfDay(null, TUESDAY)).toBe(true);
    expect(isFirstLessonOfDay("2026-10-19", TUESDAY)).toBe(true);
  });

  it("est faux pour une 2e leçon le même jour", () => {
    expect(isFirstLessonOfDay("2026-10-20", TUESDAY)).toBe(false);
  });
});

describe("getStreakWeek (la semaine de l'écran de série)", () => {
  it("va du lundi au dimanche et repère aujourd'hui", () => {
    const week = getStreakWeek(1, THURSDAY);
    expect(week.map((day) => day.label)).toEqual(["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"]);
    expect(week.filter((day) => day.isToday).map((day) => day.label)).toEqual(["Je"]);
  });

  it("coche aujourd'hui et les jours précédents de la série", () => {
    expect(doneLabels(3, THURSDAY)).toEqual(["Ma", "Me", "Je"]);
  });

  it("ne coche jamais les jours à venir", () => {
    expect(doneLabels(1, TUESDAY)).toEqual(["Ma"]);
  });

  it("s'arrête à lundi pour une longue série", () => {
    expect(doneLabels(30, SUNDAY)).toEqual(["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"]);
  });

  it("repart sur une nouvelle semaine le lundi", () => {
    expect(doneLabels(8, MONDAY)).toEqual(["Lu"]);
  });
});
