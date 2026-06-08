import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BookOpen, School, Sparkles, UserRound } from "lucide-react";
import { characterQueryOptions } from "@lib/api/characterQueries";
import { InfoSection } from "@lib/components/InfoSection";
import { useAppStore } from "@lib/hooks/useAppStore";
import { formatDate } from "@lib/utils";
import { CharacterCard } from "./-components/CharacterCard";

export const Route = createFileRoute("/(characters)/characters/$characterId")({
  loader: async ({ context, params }) => {
    const character = await context.queryClient.ensureQueryData(
      characterQueryOptions(params.characterId)
    );

    // Bug fix: No character in the API response means this route has no matching resource.
    if (!character) {
      throw notFound();
    }

    return character;
  },
  component: CharacterDetailView,
  notFoundComponent: CharacterNotFound,
});

const UNKNOWN_VALUE = "UNKNOWN";
const EMPTY_LIST_VALUE = "NONE";

const displayValue = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || String(value).trim() === "") {
    return UNKNOWN_VALUE;
  }

  return String(value).toUpperCase();
};

const displayBoolean = (value: boolean | null | undefined) => {
  // Bug fix: Missing booleans are unknown, but false is still a valid value.
  if (value === null || value === undefined) {
    return UNKNOWN_VALUE;
  }

  return value ? "YES" : "NO";
};

const displayDate = (date: string | undefined) => displayValue(formatDate(date));

const displayList = (values: string[] | null | undefined) => {
  const displayValues = values?.map((value) => value.trim()).filter(Boolean) ?? [];

  // Bug fix: Empty alternate names or actor lists should display as NONE.
  return displayValues.length ? displayValues.join(", ").toUpperCase() : EMPTY_LIST_VALUE;
};

function CharacterDetailView() {
  const { characterId } = Route.useParams();
  const { data: character } = useSuspenseQuery(characterQueryOptions(characterId));
  const favoriteCharacterIds = useAppStore((state) => state.favoriteCharacterIds);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);

  if (!character) {
    throw notFound();
  }

  return (
    <main className="mx-auto grid w-full max-w-5xl grid-cols-1 items-start gap-10 px-4 pb-12 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-12">
      <div className="flex flex-col gap-6">
        <CharacterCard
          character={character}
          isFavorite={favoriteCharacterIds.includes(character.id)}
          onFavoriteToggle={toggleFavorite}
          className="h-117.5 w-full max-w-67.5 self-center text-2xl"
        />
        <p className="text-sm leading-6 tracking-wide text-amber-50/45 uppercase">
          Also known as: {displayList(character.alternate_names)}
        </p>
      </div>

      <div className="rounded-2xl bg-gray-950/85 p-6 shadow-xl shadow-black/30 sm:p-8">
        <InfoSection title="Basic Information" icon={<UserRound aria-hidden="true" />}>
          <InfoSection.Grid>
            <InfoSection.Item label="Species" value={displayValue(character.species)} />
            <InfoSection.Item label="Gender" value={displayValue(character.gender)} />
            <InfoSection.Item label="Date of birth" value={displayDate(character.dateOfBirth)} />
            <InfoSection.Item label="Ancestry" value={displayValue(character.ancestry)} />
            <InfoSection.Item label="Eye color" value={displayValue(character.eyeColour)} />
            <InfoSection.Item label="Hair color" value={displayValue(character.hairColour)} />
          </InfoSection.Grid>
        </InfoSection>

        <InfoSection.Divider />

        <InfoSection title="Magical Information" icon={<Sparkles aria-hidden="true" />}>
          <InfoSection.Grid>
            <InfoSection.Item label="Wizard / Witch" value={displayBoolean(character.wizard)} />
            <InfoSection.Item label="Patronus" value={displayValue(character.patronus)} />
          </InfoSection.Grid>
        </InfoSection>

        <InfoSection.Divider />

        <InfoSection title="Hogwarts" icon={<School aria-hidden="true" />}>
          <InfoSection.Grid>
            <InfoSection.Item label="Student" value={displayBoolean(character.hogwartsStudent)} />
            <InfoSection.Item label="Staff" value={displayBoolean(character.hogwartsStaff)} />
          </InfoSection.Grid>
        </InfoSection>

        <InfoSection.Divider />

        <InfoSection title="Portrayed By" icon={<BookOpen aria-hidden="true" />}>
          <InfoSection.Grid>
            <InfoSection.Item label="Actor" value={displayValue(character.actor)} />
            <InfoSection.Item
              label="Alternate actors"
              value={displayList(character.alternate_actors)}
            />
          </InfoSection.Grid>
        </InfoSection>
      </div>
    </main>
  );
}

function CharacterNotFound() {
  return (
    <main className="flex flex-col items-center gap-5 px-4 py-20 text-center">
      <h2 className="text-2xl font-semibold tracking-wide uppercase">Character not found</h2>
      <p className="text-amber-50/50">The requested character does not exist.</p>
      <Link
        to="/"
        className="rounded-lg border border-amber-100/30 px-4 py-2 text-sm uppercase transition-colors hover:bg-amber-100/10"
      >
        Back to characters
      </Link>
    </main>
  );
}
