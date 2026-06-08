import { Character } from "@lib/constants/characters";
import { HouseType } from "@lib/constants/houses";

export const fetchCharacter = async (id: string): Promise<Character | null> => {
  const response = await fetch(`${import.meta.env.VITE_HARRY_POTTER_API_URL}/character/${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: Character[] = await response.json();
  // Bug fix: This endpoint returns an array even when requesting a single character.
  return data.length > 0 ? data[0] : null;
};

export const fetchCharacters = async (house?: HouseType | null): Promise<Character[]> => {
  const routeSuffix = house ? `/house/${house}` : "";
  const response = await fetch(
    `${import.meta.env.VITE_HARRY_POTTER_API_URL}/characters${routeSuffix}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
