import { characterQueryOptions, charactersQueryOptions } from "./characterQueries";

describe("charactersQueryOptions", () => {
  it("uses a distinct query key for each house and the global scope", () => {
    const gryffindorQuery = charactersQueryOptions("Gryffindor");
    const slytherinQuery = charactersQueryOptions("Slytherin");
    const globalQuery = charactersQueryOptions(null);

    expect(gryffindorQuery.queryKey).not.toEqual(slytherinQuery.queryKey);
    expect(gryffindorQuery.queryKey).not.toEqual(globalQuery.queryKey);
    expect(globalQuery.queryKey).toEqual(["characters", { house: null }]);
  });
});

describe("characterQueryOptions", () => {
  it("uses a distinct query key for each character", () => {
    const harryQuery = characterQueryOptions("1");
    const hermioneQuery = characterQueryOptions("2");

    expect(harryQuery.queryKey).not.toEqual(hermioneQuery.queryKey);
    expect(harryQuery.queryKey).toEqual(["character", { characterId: "1" }]);
  });
});
