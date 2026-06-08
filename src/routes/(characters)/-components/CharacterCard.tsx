import { cn } from "@lib/utils";
import { Character } from "@lib/constants/characters";
import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";

type CharacterCardProps = {
  character: Character;
  isFavorite: boolean;
  onFavoriteToggle: (characterId: string) => void;
  navigable?: boolean;
  className?: string;
};

export const CharacterCard = ({
  character,
  isFavorite,
  onFavoriteToggle,
  navigable = false,
  className,
}: CharacterCardProps) => {
  const characterName = character.name ?? "character";

  return (
    <article
      className={cn(
        "relative isolate flex h-87.5 flex-col justify-end overflow-hidden rounded-2xl px-3 py-6 shadow-md shadow-zinc-950",
        className
      )}
    >
      <img
        src={character.image || undefined}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-stone-900/20"></div>
      <button
        type="button"
        onClick={() => onFavoriteToggle(character.id)}
        aria-label={`${isFavorite ? "Remove" : "Add"} ${characterName} ${
          isFavorite ? "from" : "to"
        } favorites`}
        aria-pressed={isFavorite}
        className="absolute top-3 right-3 z-20 rounded-full p-1 text-amber-100 transition-colors hover:text-yellow-300 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
      >
        <Star size={24} fill={isFavorite ? "currentColor" : "none"} />
      </button>
      {/* Bug fix: Keep the card link separate from the favorite button to avoid nested interactive elements. */}
      {navigable && (
        <Link
          to="/characters/$characterId"
          params={{ characterId: character.id }}
          aria-label={`View ${characterName} details`}
          className="absolute inset-0 z-10 rounded-2xl focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:outline-none"
        />
      )}
      <h3 className="pointer-events-none z-10 font-light tracking-wide">{character.name}</h3>
    </article>
  );
};
