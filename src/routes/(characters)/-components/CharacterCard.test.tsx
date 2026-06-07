import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockCharacter } from "../../../test/mocks";
import { CharacterCard } from "./CharacterCard";

describe("CharacterCard", () => {
  it("toggles the favorite character", async () => {
    const onFavoriteToggle = vi.fn();

    render(
      <CharacterCard
        character={mockCharacter}
        isFavorite={false}
        onFavoriteToggle={onFavoriteToggle}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: "Add Harry Potter to favorites" }));

    expect(onFavoriteToggle).toHaveBeenCalledWith(mockCharacter.id);
  });
});
