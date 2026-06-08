import { create } from "zustand";
import { persist } from "zustand/middleware";
import { HouseType } from "@lib/constants/houses";

interface AppState {
  preferredHouse: HouseType | null | undefined;
  favoriteCharacterIds: string[];
  setPreferredHouse: (house: HouseType | null | undefined) => void;
  toggleFavorite: (characterId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      preferredHouse: undefined,
      favoriteCharacterIds: [],
      setPreferredHouse: (preferredHouse) => set(() => ({ preferredHouse })),
      toggleFavorite: (characterId) =>
        set((state) => ({
          favoriteCharacterIds: state.favoriteCharacterIds.includes(characterId)
            ? state.favoriteCharacterIds.filter((id) => id !== characterId)
            : [...state.favoriteCharacterIds, characterId],
        })),
    }),
    {
      name: "the-harry-potter-app-storage",
      // Bug fix: persist stable IDs only, objects bloat localStorage.
      partialize: ({ preferredHouse, favoriteCharacterIds }) => ({
        preferredHouse,
        favoriteCharacterIds,
      }),
    }
  )
);
