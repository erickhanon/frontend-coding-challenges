import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { characterQueryOptions } from "@lib/api/characterQueries";
import { useAppStore } from "@lib/hooks/useAppStore";
import { mockCharacter, mockCharacters } from "../../test/mocks";
import { renderAppRoute } from "../../test/renderAppRoute";

const expectDetailValue = (label: string, value: string) => {
  expect(screen.getByText(label).nextElementSibling).toHaveTextContent(value);
};

describe("character detail route", () => {
  beforeEach(() => {
    useAppStore.setState({
      preferredHouse: null,
      favoriteCharacterIds: [],
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("prefetches once, reuses the loader cache, and renders the detail sections", async () => {
    const characterWithFullDetail = {
      ...mockCharacter,
      alternate_actors: ["Saunders Triplets"],
    };
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(JSON.stringify([characterWithFullDetail])));

    const { queryClient } = await renderAppRoute("/characters/1");

    expect(await screen.findByRole("heading", { name: "Basic Information" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Magical Information" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Hogwarts" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Portrayed By" })).toBeInTheDocument();
    expect(
      screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)
    ).toEqual(["Basic Information", "Magical Information", "Hogwarts", "Portrayed By"]);
    expect(screen.getByText(/THE BOY WHO LIVED, THE CHOSEN ONE/)).toBeInTheDocument();
    expectDetailValue("Species", "HUMAN");
    expectDetailValue("Gender", "MALE");
    expectDetailValue("Date of birth", "JULY 31, 1980");
    expectDetailValue("Ancestry", "HALF-BLOOD");
    expectDetailValue("Eye color", "GREEN");
    expectDetailValue("Hair color", "BLACK");
    expectDetailValue("Wizard / Witch", "YES");
    expectDetailValue("Patronus", "STAG");
    expectDetailValue("Student", "YES");
    expectDetailValue("Staff", "NO");
    expectDetailValue("Actor", "DANIEL RADCLIFFE");
    expectDetailValue("Alternate actors", "SAUNDERS TRIPLETS");
    expect(queryClient.getQueryData(characterQueryOptions("1").queryKey)).toEqual(
      characterWithFullDetail
    );
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("renders clear fallback values when optional character details are missing", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            id: "missing-info",
            name: "Mystery Character",
            alternate_names: ["", "  "],
            dateOfBirth: "not-a-date",
            image: "https://example.com/mystery.jpg",
          },
        ])
      )
    );

    await renderAppRoute("/characters/missing-info");

    expect(await screen.findByText(/Also known as: NONE/)).toBeInTheDocument();
    expectDetailValue("Species", "UNKNOWN");
    expectDetailValue("Gender", "UNKNOWN");
    expectDetailValue("Date of birth", "UNKNOWN");
    expectDetailValue("Ancestry", "UNKNOWN");
    expectDetailValue("Eye color", "UNKNOWN");
    expectDetailValue("Hair color", "UNKNOWN");
    expectDetailValue("Wizard / Witch", "UNKNOWN");
    expectDetailValue("Patronus", "UNKNOWN");
    expectDetailValue("Student", "UNKNOWN");
    expectDetailValue("Staff", "UNKNOWN");
    expectDetailValue("Actor", "UNKNOWN");
    expectDetailValue("Alternate actors", "NONE");
  });

  it("renders the route not-found boundary for an empty API response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify([])));

    await renderAppRoute("/characters/missing");

    expect(await screen.findByRole("heading", { name: "Character not found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to characters" })).toBeInTheDocument();
  });

  it("returns to the list through history after card navigation", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify(mockCharacters)))
    );
    const { router } = await renderAppRoute();

    await userEvent.click(await screen.findByRole("link", { name: "View Harry Potter details" }));
    await screen.findByRole("heading", { name: "Basic Information" });
    await userEvent.click(screen.getByRole("button", { name: "Go back" }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/");
    });
  });

  it("falls back to the list when a direct visit has no history entry", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify([mockCharacter])))
    );
    const { router } = await renderAppRoute("/characters/1");

    await screen.findByRole("heading", { name: "Basic Information" });
    await userEvent.click(screen.getByRole("button", { name: "Go back" }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/");
    });
  });
});
