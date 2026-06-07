import { validateCharacterSearch } from "./filters";

describe("validateCharacterSearch", () => {
  it.each(["students", "staff", "favorite"] as const)("accepts the %s filter", (filter) => {
    expect(validateCharacterSearch({ filter })).toEqual({ filter });
  });

  it("falls back to all characters for a missing or invalid filter", () => {
    expect(validateCharacterSearch({})).toEqual({ filter: undefined });
    expect(validateCharacterSearch({ filter: "invalid" })).toEqual({ filter: undefined });
  });
});
