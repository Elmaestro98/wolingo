import { computeLessonResult } from "@/lib/lesson-result";

const ONE_MINUTE = 60_000;

describe("computeLessonResult", () => {
  it("donne 3 étoiles et le bonus de 20 XP pour une leçon sans faute", () => {
    expect(computeLessonResult(5, 0, 6 * ONE_MINUTE)).toEqual({ xp: 70, accuracy: 1, stars: 3, minutes: 6 });
  });

  it("donne 2 étoiles avec au moins 70 % de précision", () => {
    expect(computeLessonResult(5, 1, ONE_MINUTE).stars).toBe(2);
  });

  it("donne 1 étoile et pas de bonus avec beaucoup d'erreurs", () => {
    expect(computeLessonResult(2, 3, 1000)).toEqual({ xp: 20, accuracy: 0.4, stars: 1, minutes: 1 });
  });

  it("compte au moins 1 minute, même pour une leçon très courte", () => {
    expect(computeLessonResult(1, 0, 5000).minutes).toBe(1);
  });
});
