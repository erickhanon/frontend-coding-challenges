import { useQuery } from "@tanstack/react-query";
import { charactersQueryOptions } from "@lib/api/characterQueries";
import { CharacterFilterType } from "@lib/constants/filters";
import { useAppStore } from "@lib/hooks/useAppStore";
import { filterCharacters } from "@lib/utils/filterCharacters";

export const useCharacters = (filter?: CharacterFilterType) => {
  const preferredHouse = useAppStore((state) => state.preferredHouse);
  const favoriteCharacterIds = useAppStore((state) => state.favoriteCharacterIds);
  const { data, ...rest } = useQuery({
    ...charactersQueryOptions(preferredHouse ?? null),
    // Bug fix: undefined means the house choice is incomplete; null is the valid global scope.
    enabled: preferredHouse !== undefined,
  });

  // Bug fix: favorites are filtered inside the current house/global query scope, not globally.
  const characters = filterCharacters(
    data?.filter((character) => character.image) || [],
    filter,
    favoriteCharacterIds
  );

  return {
    characters,
    ...rest,
  };
};
