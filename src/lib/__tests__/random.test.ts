import { shuffle } from "@/lib/random";

describe("shuffle (mélange)", () => {
  it("garde exactement les mêmes éléments", () => {
    const items = [1, 2, 3, 4, 5, 6];
    // On trie le résultat pour le comparer : l'ordre change, pas le contenu
    expect([...shuffle(items)].sort()).toEqual(items);
  });

  it("ne modifie pas la liste de départ", () => {
    const items = [1, 2, 3, 4, 5, 6];
    shuffle(items);
    expect(items).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
