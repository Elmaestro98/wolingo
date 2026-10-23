import { computeHearts, formatCountdown, getTimeUntilNextHeart, loseOneHeart } from "@/lib/hearts";

const MIN = 60_000;
const T0 = 1_000_000_000_000; // un instant de référence quelconque
const FULL = { hearts: 5, refillStartedAt: null };

describe("vies qui se rechargent", () => {
  it("ne change rien quand les vies sont pleines", () => {
    expect(computeHearts(FULL, T0 + 999 * MIN)).toEqual(FULL);
  });

  it("commence la recharge à la première vie perdue", () => {
    expect(loseOneHeart(FULL, T0)).toEqual({ hearts: 4, refillStartedAt: T0 });
  });

  it("rend une vie au bout de 30 minutes, pas avant", () => {
    const afterLoss = loseOneHeart(FULL, T0);
    expect(computeHearts(afterLoss, T0 + 29 * MIN).hearts).toBe(4);
    expect(computeHearts(afterLoss, T0 + 30 * MIN)).toEqual(FULL);
  });

  it("calcule les vies regagnées et la prochaine vie (2 vies, 70 min plus tard)", () => {
    const two = { hearts: 2, refillStartedAt: T0 };
    expect(computeHearts(two, T0 + 70 * MIN)).toEqual({ hearts: 4, refillStartedAt: T0 + 60 * MIN });
    expect(getTimeUntilNextHeart(two, T0 + 70 * MIN)).toBe(20 * MIN);
  });

  it("ne dépasse jamais 5 vies", () => {
    expect(computeHearts({ hearts: 2, refillStartedAt: T0 }, T0 + 180 * MIN).hearts).toBe(5);
  });

  it("ne descend jamais sous 0", () => {
    const zero = loseOneHeart({ hearts: 1, refillStartedAt: T0 }, T0 + 10 * MIN);
    expect(zero).toEqual({ hearts: 0, refillStartedAt: T0 });
    expect(loseOneHeart(zero, T0 + 11 * MIN).hearts).toBe(0);
  });

  it("n'a pas de compte à rebours quand les vies sont pleines", () => {
    expect(getTimeUntilNextHeart(FULL, T0)).toBeNull();
  });

  it("affiche le compte à rebours en MM:SS", () => {
    expect(formatCountdown(24 * MIN + 13_000)).toBe("24:13");
  });
});
