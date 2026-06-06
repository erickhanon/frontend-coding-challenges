import { queryOptions } from "@tanstack/react-query";
import { HouseType } from "@lib/constants/houses";
import { fetchCharacters } from "./characters";

export const charactersQueryOptions = (house: HouseType | null) =>
  queryOptions({
    queryKey: ["characters", { house }] as const,
    queryFn: () => fetchCharacters(house),
    staleTime: Infinity,
  });
