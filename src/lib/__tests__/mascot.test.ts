import { COMBO_THRESHOLD, ENCOURAGEMENTS, getMascotReaction } from "@/lib/mascot";

describe("réaction du lion", () => {
  it("est content, sans bulle, pour une bonne réponse isolée", () => {
    expect(getMascotReaction(true, 1, 0)).toEqual({ mood: "happy", message: null });
  });

  it("fête la série à partir de 3 bonnes réponses d'affilée", () => {
    expect(getMascotReaction(true, COMBO_THRESHOLD - 1, 0).mood).toBe("happy");
    expect(getMascotReaction(true, COMBO_THRESHOLD, 0)).toEqual({
      mood: "combo",
      message: "3 d'affilée ! 🔥",
    });
    expect(getMascotReaction(true, 7, 2).message).toBe("7 d'affilée ! 🔥");
  });

  it("encourage après une erreur, même au milieu d'une série", () => {
    expect(getMascotReaction(false, 5, 1)).toEqual({ mood: "sad", message: ENCOURAGEMENTS[0] });
  });

  it("change d'encouragement à chaque erreur, puis recommence au début", () => {
    const messages = [1, 2, 3, 4].map((mistakes) => getMascotReaction(false, 0, mistakes).message);
    expect(messages).toEqual([ENCOURAGEMENTS[0], ENCOURAGEMENTS[1], ENCOURAGEMENTS[2], ENCOURAGEMENTS[0]]);
  });
});
