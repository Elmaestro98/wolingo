import { deremToCfa, findDeremAnswerIndex, formatNumber } from "@/lib/derem";

describe("dërëm", () => {
  it("convertit les dërëm en F CFA (1 dërëm = 5 F)", () => {
    expect(deremToCfa(100)).toBe(500);
  });

  it.each([
    [500, "500"],
    [5000, "5 000"],
    [1250000, "1 250 000"],
  ])("écrit %d comme « %s »", (value, expected) => {
    expect(formatNumber(value)).toBe(expected);
  });

  it("trouve la bonne réponse par le calcul", () => {
    expect(findDeremAnswerIndex(500, [100, 10, 1000, 20])).toBe(0);
    expect(findDeremAnswerIndex(100, [100, 10, 1000, 20])).toBe(3);
  });

  it("renvoie -1 si aucun choix ne correspond (erreur de contenu)", () => {
    expect(findDeremAnswerIndex(700, [100, 10, 1000, 20])).toBe(-1);
  });
});
