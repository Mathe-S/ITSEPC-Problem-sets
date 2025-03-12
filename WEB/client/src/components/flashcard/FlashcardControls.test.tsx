import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import FlashcardControls from "./FlashcardControls";

describe("FlashcardControls", () => {
  it("calls the correct handler when difficulty buttons are clicked", async () => {
    const user = userEvent.setup();
    const mockOnDifficultySelected = vi.fn();

    render(
      <FlashcardControls
        onDifficultySelected={mockOnDifficultySelected}
        answerRevealed={true}
      />
    );

    // Using async/await with user-event for more realistic interactions
    await user.click(screen.getByText("Easy"));
    expect(mockOnDifficultySelected).toHaveBeenCalledWith("easy");

    await user.click(screen.getByText("Hard"));
    expect(mockOnDifficultySelected).toHaveBeenCalledWith("hard");

    await user.click(screen.getByText("Wrong"));
    expect(mockOnDifficultySelected).toHaveBeenCalledWith("wrong");
  });

  it("disables buttons when answer is not revealed", () => {
    render(
      <FlashcardControls
        onDifficultySelected={vi.fn()}
        answerRevealed={false}
      />
    );

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });
});
