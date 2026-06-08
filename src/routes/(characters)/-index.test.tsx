import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAppStore } from "@lib/hooks/useAppStore";
import { mockCharacters } from "../../test/mocks";
import { renderAppRoute } from "../../test/renderAppRoute";

describe("characters index route filters", () => {
  beforeEach(() => {
    useAppStore.setState({
      preferredHouse: null,
      favoriteCharacterIds: [],
    });
    vi.spyOn(globalThis, "fetch").mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify(mockCharacters)))
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("updates and removes the filter search parameter from filter button clicks", async () => {
    const { router } = await renderAppRoute();

    await userEvent.click(screen.getByRole("button", { name: "Students" }));

    await waitFor(() => {
      expect(router.state.location.search).toEqual({ filter: "students" });
    });
    expect(screen.getByRole("button", { name: "Students" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    await userEvent.click(screen.getByRole("button", { name: "Staff" }));

    await waitFor(() => {
      expect(router.state.location.search).toEqual({ filter: "staff" });
    });

    await act(() => router.history.back());

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Students" })).toHaveAttribute(
        "aria-pressed",
        "true"
      );
    });

    await userEvent.click(screen.getByRole("button", { name: "All Characters" }));

    await waitFor(() => {
      expect(router.state.location.search).toEqual({});
    });
    expect(screen.getByRole("button", { name: "All Characters" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("falls back to All Characters when the URL contains an invalid filter", async () => {
    await renderAppRoute("/?filter=invalid");

    expect(await screen.findByText("Harry Potter")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All Characters" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });
});

describe("characters index route card interactions", () => {
  beforeEach(() => {
    useAppStore.setState({
      preferredHouse: null,
      favoriteCharacterIds: [],
    });
    vi.spyOn(globalThis, "fetch").mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify(mockCharacters)))
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("navigates to the typed character detail route from a card", async () => {
    const { router } = await renderAppRoute();

    await userEvent.click(await screen.findByRole("link", { name: "View Harry Potter details" }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/characters/1");
    });
  });

  it("toggles a favorite without navigating to the detail route", async () => {
    const toggleFavorite = vi.spyOn(useAppStore.getState(), "toggleFavorite");
    const { router } = await renderAppRoute();

    await userEvent.click(
      await screen.findByRole("button", { name: "Add Harry Potter to favorites" })
    );

    expect(toggleFavorite).toHaveBeenCalledWith(mockCharacters[0].id);
    expect(useAppStore.getState().favoriteCharacterIds).toEqual([mockCharacters[0].id]);
    expect(router.state.location.pathname).toBe("/");
  });
});
