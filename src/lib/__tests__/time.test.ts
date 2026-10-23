import { addMinutes, formatTime, getTimeCaption } from "@/lib/time";

describe("heures du rappel (minutes depuis minuit)", () => {
  it.each([
    [1140, "19:00"],
    [485, "08:05"],
    [0, "00:00"],
  ])("formatTime(%d) → « %s »", (minutes, expected) => {
    expect(formatTime(minutes)).toBe(expected);
  });

  it("passe minuit en avançant (23:45 + 15 min → 00:00)", () => {
    expect(addMinutes(1425, 15)).toBe(0);
  });

  it("passe minuit en reculant (00:00 − 15 min → 23:45)", () => {
    expect(addMinutes(0, -15)).toBe(1425);
  });

  it("choisit la légende selon l'heure", () => {
    expect(getTimeCaption(480)).toBe("Pour bien démarrer la journée");
    expect(getTimeCaption(1140)).toBe("L'heure du thé ataya");
    expect(getTimeCaption(1290)).toBe("Avant de dormir, pour bien retenir");
  });
});
