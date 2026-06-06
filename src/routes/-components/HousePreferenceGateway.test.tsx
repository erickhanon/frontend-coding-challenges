import { render, screen } from "@testing-library/react";
import { useAppStore } from "@lib/hooks/useAppStore";
import { HousePreferenceGateway } from "./HousePreferenceGateway";

describe("HousePreferenceGateway", () => {
  beforeEach(() => {
    useAppStore.setState({ preferredHouse: undefined });
  });

  it("shows house selection while the preference is undefined", () => {
    render(
      <HousePreferenceGateway>
        <p>Character list</p>
      </HousePreferenceGateway>
    );

    expect(screen.getByRole("heading", { name: "Choose your preferred house" })).toBeInTheDocument();
    expect(screen.queryByText("Character list")).not.toBeInTheDocument();
  });

  it("renders the application when null represents the global scope", () => {
    useAppStore.setState({ preferredHouse: null });

    render(
      <HousePreferenceGateway>
        <p>Character list</p>
      </HousePreferenceGateway>
    );

    expect(screen.getByText("Character list")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Choose your preferred house" })
    ).not.toBeInTheDocument();
  });
});
