import { charactersQueryOptions } from "./characterQueries";

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
