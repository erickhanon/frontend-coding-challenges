export const characterFilters = ["students", "staff", "favorite"] as const;

export type CharacterFilterType = (typeof characterFilters)[number];

export type CharacterSearch = {
  filter?: CharacterFilterType;
};

export const isCharacterFilter = (value: unknown): value is CharacterFilterType =>
  characterFilters.some((filter) => filter === value);

// Bug fix: invalid URL filters fall back to All Characters.
export const validateCharacterSearch = (search: Record<string, unknown>): CharacterSearch => ({
  filter: isCharacterFilter(search.filter) ? search.filter : undefined,
});
