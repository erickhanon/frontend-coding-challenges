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
    enabled: preferredHouse !== undefined,
  });

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
