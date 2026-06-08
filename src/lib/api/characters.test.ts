import { fetchCharacter, fetchCharacters } from "./characters";
import { mockCharacter, mockCharacters } from "../../test/mocks";

const API_URL = "https://hp-api.onrender.com/api";

beforeEach(() => {
  vi.stubEnv("VITE_HARRY_POTTER_API_URL", API_URL);
  vi.restoreAllMocks();
});

describe("fetchCharacter", () => {
  it("returns the first character when found", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify([mockCharacter, mockCharacters[1]]))
    );

    const result = await fetchCharacter("1");
    expect(result).toEqual(mockCharacter);
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/character/1`);
  });

  it("returns null when character is not found", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify([])));

    const result = await fetchCharacter("999");
    expect(result).toBeNull();
  });

  it("throws on network error", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 500, statusText: "Internal Server Error" })
    );

    await expect(fetchCharacter("1")).rejects.toThrow("Network response was not ok");
  });
});

describe("fetchCharacters", () => {
  it("fetches all characters when no house is specified", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify(mockCharacters)));

    const result = await fetchCharacters();
    expect(result).toEqual(mockCharacters);
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/characters`);
  });

  it("fetches characters filtered by house", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify([mockCharacter])));

    const result = await fetchCharacters("Gryffindor");
    expect(result).toEqual([mockCharacter]);
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/characters/house/Gryffindor`);
  });

  it("fetches all characters when house is null", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify(mockCharacters)));

    await fetchCharacters(null);
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/characters`);
  });

  it("throws on network error", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 404, statusText: "Not Found" })
    );

    await expect(fetchCharacters()).rejects.toThrow("Network response was not ok");
  });
});
