import { Character } from "@lib/constants/characters";
import { CharacterFilterType } from "@lib/constants/filters";

export const filterCharacters = (
  characters: Character[],
  filter: CharacterFilterType | undefined,
  favoriteCharacterIds: string[]
) => {
  switch (filter) {
    case "students":
      return characters.filter((character) => character.hogwartsStudent);
    case "staff":
      return characters.filter((character) => character.hogwartsStaff);
    case "favorite": {
      const favoriteIds = new Set(favoriteCharacterIds);
      return characters.filter((character) => favoriteIds.has(character.id));
    }
    default:
      return characters;
  }
};
