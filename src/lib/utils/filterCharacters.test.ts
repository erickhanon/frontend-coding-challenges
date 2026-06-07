import { mockCharacters } from "../../test/mocks";
import { filterCharacters } from "./filterCharacters";

describe("filterCharacters", () => {
  it("returns all characters when no filter is active", () => {
    expect(filterCharacters(mockCharacters, undefined, [])).toEqual(mockCharacters);
  });

  it("returns only students", () => {
    const characters = filterCharacters(mockCharacters, "students", []);

    expect(characters.map((character) => character.id)).toEqual(["1", "2"]);
  });

  it("returns only staff", () => {
    const characters = filterCharacters(mockCharacters, "staff", []);

    expect(characters.map((character) => character.id)).toEqual(["3"]);
  });

  it("returns only favorites from the provided character scope", () => {
    const gryffindorCharacters = mockCharacters.filter(
      (character) => character.house === "Gryffindor"
    );

    const characters = filterCharacters(gryffindorCharacters, "favorite", ["1", "3"]);

    expect(characters.map((character) => character.id)).toEqual(["1"]);
  });
});
