import { useAppStore } from "./useAppStore";

describe("useAppStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useAppStore.setState({
      preferredHouse: undefined,
      favoriteCharacterIds: [],
    });
  });

  describe("setPreferredHouse", () => {
    it("sets a specific house", () => {
      useAppStore.getState().setPreferredHouse("Gryffindor");
      expect(useAppStore.getState().preferredHouse).toBe("Gryffindor");
    });

    it("sets null to show all characters", () => {
      useAppStore.getState().setPreferredHouse(null);
      expect(useAppStore.getState().preferredHouse).toBeNull();
    });

    it("sets undefined to trigger house selection", () => {
      useAppStore.getState().setPreferredHouse("Slytherin");
      useAppStore.getState().setPreferredHouse(undefined);
      expect(useAppStore.getState().preferredHouse).toBeUndefined();
    });
  });

  describe("toggleFavorite", () => {
    it("adds and removes a favorite character ID", () => {
      useAppStore.getState().toggleFavorite("1");
      expect(useAppStore.getState().favoriteCharacterIds).toEqual(["1"]);

      useAppStore.getState().toggleFavorite("1");
      expect(useAppStore.getState().favoriteCharacterIds).toEqual([]);
    });

    it("persists only the preferred house and favorite IDs", () => {
      useAppStore.getState().setPreferredHouse("Gryffindor");
      useAppStore.getState().toggleFavorite("1");

      const persistedValue = JSON.parse(
        localStorage.getItem("the-harry-potter-app-storage") ?? "{}"
      );

      expect(persistedValue.state).toEqual({
        preferredHouse: "Gryffindor",
        favoriteCharacterIds: ["1"],
      });
    });
  });

  it("hydrates an older persisted state that does not contain favorites", async () => {
    localStorage.setItem(
      "the-harry-potter-app-storage",
      JSON.stringify({
        state: { preferredHouse: "Ravenclaw" },
        version: 0,
      })
    );

    await useAppStore.persist.rehydrate();

    expect(useAppStore.getState().preferredHouse).toBe("Ravenclaw");
    expect(useAppStore.getState().favoriteCharacterIds).toEqual([]);
  });
});
