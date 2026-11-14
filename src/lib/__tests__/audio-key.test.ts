import { WOLOF_AUDIO } from "@/content/audio-manifest";
import { LESSONS } from "@/content/lessons";
import { collectWolofTexts } from "@/content/wolof-texts";
import { audioKey } from "@/lib/audio-key";

describe("noms des fichiers audio", () => {
  it("retire accents, majuscules et ponctuation", () => {
    expect(audioKey("Jërëjëf")).toBe("jerejef");
    expect(audioKey("Nanga def ?")).toBe("nanga-def");
    expect(audioKey("Déedéet")).toBe("deedeet");
    expect(audioKey("Ba beneen yoon")).toBe("ba-beneen-yoon");
  });

  it("garde ñ différent de n (ñu = ils, nu = nous)", () => {
    expect(audioKey("ñu")).toBe("nyu");
    expect(audioKey("nu")).toBe("nu");
  });

  it("liste les 9 textes à écouter de la leçon 1", () => {
    expect(collectWolofTexts(LESSONS["u1-l1"])).toHaveLength(9);
  });

  it("chaque voix du manifeste correspond à un texte d'une leçon", () => {
    const keys = new Set(Object.values(LESSONS).flatMap((lesson) => collectWolofTexts(lesson).map(audioKey)));
    for (const key of Object.keys(WOLOF_AUDIO)) expect(keys).toContain(key);
  });
});
