import type { Module, PathItem } from "@/content/modules";
import {
  areAllLessonsCompleted,
  getCurrentModule,
  getPathItemStates,
  getZigzagOffset,
  isModuleCompleted,
} from "@/lib/path";

const ITEMS: PathItem[] = [
  { id: "l1", kind: "lesson", title: "Leçon 1" },
  { id: "l2", kind: "lesson", title: "Leçon 2" },
  { id: "chest", kind: "chest", title: "Coffre", xpReward: 15 },
  { id: "l3", kind: "lesson", title: "Leçon 3" },
  { id: "quiz", kind: "quiz", title: "Quiz" },
];

/** Raccourci : la liste des statuts, dans l'ordre */
function statuses(completed: Record<string, number>) {
  return getPathItemStates(ITEMS, completed).map((state) => state.status);
}

describe("getPathItemStates (le chemin du Parcours)", () => {
  it("met la première étape « en cours » quand rien n'est fait", () => {
    expect(statuses({})).toEqual(["current", "locked", "locked", "locked", "locked"]);
  });

  it("ouvre le coffre tout seul quand tout ce qui le précède est terminé", () => {
    expect(statuses({ l1: 3, l2: 2 })).toEqual(["completed", "completed", "completed", "current", "locked"]);
  });

  it("numérote seulement les leçons (pas le coffre ni le quiz)", () => {
    const numbers = getPathItemStates(ITEMS, {}).map((state) => state.lessonNumber);
    expect(numbers).toEqual([1, 2, null, 3, null]);
  });

  it("garde les étoiles obtenues", () => {
    expect(getPathItemStates(ITEMS, { l1: 2 })[0].stars).toBe(2);
  });
});

describe("règle du quiz : toutes les leçons du module d'abord", () => {
  it("garde le quiz verrouillé tant qu'une leçon n'est pas terminée", () => {
    expect(statuses({ l1: 3, l2: 1 }).at(-1)).toBe("locked"); // l3 pas faite
  });

  it("ouvre le quiz quand toutes les leçons sont terminées", () => {
    expect(statuses({ l1: 3, l2: 1, l3: 2 }).at(-1)).toBe("current");
  });

  it("refuse le quiz même s'il est placé AVANT une leçon pas encore faite", () => {
    const quizInTheMiddle: PathItem[] = [
      { id: "l1", kind: "lesson", title: "Leçon 1" },
      { id: "quiz", kind: "quiz", title: "Quiz" },
      { id: "l2", kind: "lesson", title: "Leçon 2" },
    ];
    const states = getPathItemStates(quizInTheMiddle, { l1: 3 }).map((state) => state.status);
    // Le quiz n'est pas jouable : c'est la leçon 2 qui devient « en cours »
    expect(states).toEqual(["completed", "locked", "current"]);
  });

  it("areAllLessonsCompleted ignore le coffre et le quiz", () => {
    expect(areAllLessonsCompleted(ITEMS, { l1: 1, l2: 1, l3: 1 })).toBe(true);
    expect(areAllLessonsCompleted(ITEMS, { l1: 1, l2: 1 })).toBe(false);
  });
});

describe("module en cours sur le Parcours", () => {
  /** Fabrique un petit module de test : une leçon + un quiz */
  function makeModule(number: number, withContent = true): Module {
    return {
      id: `m${number}`,
      number,
      level: "A1",
      title: `Module ${number}`,
      subtitle: "",
      example: "",
      items: withContent
        ? [
            { id: `m${number}-l1`, kind: "lesson", title: "Leçon" },
            { id: `m${number}-quiz`, kind: "quiz", title: "Quiz" },
          ]
        : [],
    };
  }
  const MODULES_FOR_TEST = [makeModule(1), makeModule(2), makeModule(3, false)];

  it("commence par le module 1", () => {
    expect(getCurrentModule(MODULES_FOR_TEST, {}).id).toBe("m1");
  });

  it("passe au module 2 quand le quiz du module 1 est réussi", () => {
    expect(isModuleCompleted(MODULES_FOR_TEST[0], { "m1-quiz": 2 })).toBe(true);
    expect(getCurrentModule(MODULES_FOR_TEST, { "m1-l1": 3, "m1-quiz": 2 }).id).toBe("m2");
  });

  it("ne passe PAS au module suivant tant que seul le quiz manque", () => {
    expect(getCurrentModule(MODULES_FOR_TEST, { "m1-l1": 3 }).id).toBe("m1");
  });

  it("saute les modules encore vides et reste sur le dernier jouable", () => {
    const allDone = { "m1-l1": 3, "m1-quiz": 3, "m2-l1": 3, "m2-quiz": 3 };
    expect(getCurrentModule(MODULES_FOR_TEST, allDone).id).toBe("m2");
  });
});

describe("getZigzagOffset", () => {
  it("répète le motif en boucle", () => {
    expect(getZigzagOffset(6)).toBe(getZigzagOffset(0));
  });
});
