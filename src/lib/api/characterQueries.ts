import { queryOptions } from "@tanstack/react-query";
import { HouseType } from "@lib/constants/houses";
import { fetchCharacter, fetchCharacters } from "./characters";

export const charactersQueryOptions = (house: HouseType | null) =>
  queryOptions({
    // Bug fix: house/global scope belongs in the key or React Query can reuse stale lists.
    queryKey: ["characters", { house }] as const,
    queryFn: () => fetchCharacters(house),
    staleTime: Infinity,
  });

export const characterQueryOptions = (characterId: string) =>
  queryOptions({
    // Bug fix: loader and component share this exact key to avoid a second detail fetch.
    queryKey: ["character", { characterId }] as const,
    queryFn: () => fetchCharacter(characterId),
    staleTime: Infinity,
  });
