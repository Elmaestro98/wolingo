import { LESSONS } from "@/content/lessons";
import { addDaysToKey } from "@/lib/dates";
import {
  buildReviewSession,
  getDueRefs,
  getStepFromRef,
  getStepRef,
  REVIEW_SESSION_SIZE,
  scheduleAfterMistake,
  scheduleAfterSuccess,
} from "@/lib/review";

const OCT_20 = new Date(2026, 9, 20);

describe("dates de révision", () => {
  it("ajoute des jours, même en changeant de mois", () => {
    expect(addDaysToKey(new Date(2026, 9, 30), 3)).toBe("2026-11-02");
  });
});

describe("références d'exercices", () => {
  it("fait l'aller-retour étape → « leçon#position » → étape", () => {
    const step = LESSONS["u1-l3"].steps[1];
    const ref = getStepRef(step);
    expect(ref).toBe("u1-l3#1");
    expect(getStepFromRef(ref!)).toBe(step);
  });

  it("ne trouve rien pour une référence disparue du contenu", () => {
    expect(getStepFromRef("leçon-supprimée#3")).toBeUndefined();
  });
});

describe("paliers J+1, J+3, J+7", () => {
  it("une erreur → revient demain (palier 0)", () => {
    expect(scheduleAfterMistake(OCT_20)).toEqual({ dueDateKey: "2026-10-21", intervalIndex: 0 });
  });

  it("une réussite fait monter d'un palier : J+3 puis J+7", () => {
    expect(scheduleAfterSuccess({ dueDateKey: "2026-10-20", intervalIndex: 0 }, OCT_20)).toEqual({
      dueDateKey: "2026-10-23",
      intervalIndex: 1,
    });
    expect(scheduleAfterSuccess({ dueDateKey: "2026-10-20", intervalIndex: 1 }, OCT_20)?.dueDateKey).toBe(
      "2026-10-27",
    );
  });

  it("après le dernier palier, l'exercice est maîtrisé (null)", () => {
    expect(scheduleAfterSuccess({ dueDateKey: "2026-10-20", intervalIndex: 2 }, OCT_20)).toBeNull();
  });
});

describe("séance du jour", () => {
  const ITEMS = {
    "u1-l3#1": { dueDateKey: "2026-10-18", intervalIndex: 0 }, // en retard
    "u1-l3#3": { dueDateKey: "2026-10-20", intervalIndex: 1 }, // aujourd'hui
    "u1-l4#2": { dueDateKey: "2026-10-25", intervalIndex: 2 }, // plus tard
  };

  it("garde aujourd'hui et le retard, les plus anciens d'abord", () => {
    expect(getDueRefs(ITEMS, OCT_20)).toEqual(["u1-l3#1", "u1-l3#3"]);
  });

  it("construit une séance avec ces exercices", () => {
    const session = buildReviewSession(ITEMS, OCT_20);
    expect(session?.steps).toHaveLength(2);
    expect(session?.steps[0]).toBe(LESSONS["u1-l3"].steps[1]);
  });

  it("ne dépasse pas la taille maximale", () => {
    const many = Object.fromEntries(
      LESSONS["u1-l1"].steps
        .concat(LESSONS["u1-l3"].steps)
        .map((step) => [getStepRef(step)!, { dueDateKey: "2026-10-01", intervalIndex: 0 }]),
    );
    expect(buildReviewSession(many, OCT_20)!.steps.length).toBeLessThanOrEqual(REVIEW_SESSION_SIZE);
  });

  it("pas de séance quand rien n'est à revoir", () => {
    expect(buildReviewSession({}, OCT_20)).toBeUndefined();
  });
});
