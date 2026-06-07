import { createFileRoute } from "@tanstack/react-router";
import { validateCharacterSearch } from "@lib/constants/filters";
import { CharacterFilters } from "./-components/CharacterFilters";
import { CharactersGrid } from "./-components/CharactersGrid";

export const Route = createFileRoute("/(characters)/")({
  validateSearch: validateCharacterSearch,
  component: CharactersIndexView,
});

function CharactersIndexView() {
  const { filter } = Route.useSearch();
  const navigate = Route.useNavigate();

  const handleFilterChange = (nextFilter: typeof filter) => {
    navigate({ search: nextFilter ? { filter: nextFilter } : {} });
  };

  return (
    <main className="flex flex-col gap-8 pb-8">
      <CharacterFilters activeFilter={filter} onFilterChange={handleFilterChange} />
      <CharactersGrid filter={filter} />
    </main>
  );
}
