import { Button } from "@lib/components/Button";
import { CharacterFilterType } from "@lib/constants/filters";

type CharacterFiltersProps = {
  activeFilter?: CharacterFilterType;
  onFilterChange: (filter?: CharacterFilterType) => void;
};

const filterOptions: { label: string; value?: CharacterFilterType }[] = [
  { label: "All Characters" },
  { label: "Students", value: "students" },
  { label: "Staff", value: "staff" },
  { label: "Favorite", value: "favorite" },
];

export const CharacterFilters = ({ activeFilter, onFilterChange }: CharacterFiltersProps) => (
  <nav aria-label="Character filters" className="flex justify-center px-4">
    <div className="flex max-w-full gap-2 overflow-x-auto rounded-xl bg-amber-950/15 p-1">
      {filterOptions.map(({ label, value }) => (
        <Button
          key={label}
          active={activeFilter === value}
          onClick={() => onFilterChange(value)}
          aria-pressed={activeFilter === value}
        >
          {label}
        </Button>
      ))}
    </div>
  </nav>
);
