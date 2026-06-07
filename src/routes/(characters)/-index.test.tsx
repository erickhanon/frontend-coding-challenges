import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAppStore } from "@lib/hooks/useAppStore";
import { routeTree } from "../../routeTree.gen";
import { mockCharacters } from "../../test/mocks";

const renderCharactersRoute = async (initialEntry = "/") => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const history = createMemoryHistory({ initialEntries: [initialEntry] });
  const router = createRouter({
    routeTree,
    history,
    context: {
      queryClient,
    },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );

  await act(() => router.load());

  return router;
};

describe("characters index route filters", () => {
  beforeEach(() => {
    useAppStore.setState({
      preferredHouse: null,
      favoriteCharacterIds: [],
    });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify(mockCharacters)));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("updates and removes the filter search parameter from filter button clicks", async () => {
    const router = await renderCharactersRoute();

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
    await renderCharactersRoute("/?filter=invalid");

    expect(await screen.findByText("Harry Potter")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All Characters" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });
});
