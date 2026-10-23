import { checkTypedAnswer } from "@/lib/answer-checker";

const ACCEPTED = ["Mangi jel sumë tééré", "Mangi jël sumë téere"];

describe("checkTypedAnswer (correction tolérante)", () => {
  // it.each : le même test avec plusieurs exemples (un par ligne)
  it.each([
    ["Mangi jel sumë tééré", "exact"],
    ["mangi jel sumë tééré.", "exact"], //           majuscule et point ignorés
    ["  Mangi   jel sumë tééré !  ", "exact"], //    espaces en trop ignorés
    ["Mangi jël sumë téere", "exact"], //            2e orthographe acceptée
    ["Mangi jel sume teere", "near"], //             accents oubliés : accepté mais signalé
    ["Mangi jel sume tere", "near"], //              double lettre oubliée (teere → tere) : accepté mais signalé
    ["Mangi jel sume ter", "wrong"], //              il manque vraiment une lettre
    ["Mangi am tééré", "wrong"],
    ["", "wrong"],
  ])("« %s » → %s", (typed, expected) => {
    expect(checkTypedAnswer(typed, ACCEPTED)).toBe(expected);
  });

  it("accepte une double lettre oubliée, mais le signale (cahier : niveau 1)", () => {
    expect(checkTypedAnswer("Mangi fi", ["Mangi fii"])).toBe("near");
    expect(checkTypedAnswer("Mangi fii", ["Mangi fii"])).toBe("exact");
  });

  it("ne confond pas ñ et n (ce ne sont pas des accents)", () => {
    expect(checkTypedAnswer("ñaar", ["ñaar"])).toBe("exact");
    expect(checkTypedAnswer("naar", ["ñaar"])).toBe("wrong");
  });
});
