import { useQuery } from "@tanstack/react-query";
import { charactersQueryOptions } from "@lib/api/characterQueries";
import { useAppStore } from "@lib/hooks/useAppStore";

export const useCharacters = () => {
  const { preferredHouse } = useAppStore();
  const { data, ...rest } = useQuery({
    ...charactersQueryOptions(preferredHouse ?? null),
    enabled: preferredHouse !== undefined,
  });

  const characters = data?.filter((character) => character.image) || [];

  return {
    characters,
    ...rest,
  };
};
