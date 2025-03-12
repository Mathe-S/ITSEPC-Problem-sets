import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Flashcard from "./Flashcard";

describe("Flashcard Component", () => {
  const mockCard = {
    id: "1",
    front: "What is React?",
    back: "A JavaScript library for building user interfaces",
    bucketId: 1,
  };

  it("renders the front of the card by default", () => {
    render(<Flashcard card={mockCard} />);
    expect(screen.getByText("What is React?")).toBeInTheDocument();
    expect(
      screen.queryByText("A JavaScript library for building user interfaces")
    ).not.toBeInTheDocument();
  });

  it("flips to show the back of the card when the button is clicked", () => {
    render(<Flashcard card={mockCard} />);
    fireEvent.click(screen.getByText(/show answer/i));
    expect(
      screen.getByText("A JavaScript library for building user interfaces")
    ).toBeInTheDocument();
  });

  it("calls the onFlip callback when the card is flipped", () => {
    const mockOnFlip = vi.fn();
    render(<Flashcard card={mockCard} onFlip={mockOnFlip} />);
    fireEvent.click(screen.getByText(/show answer/i));
    expect(mockOnFlip).toHaveBeenCalledTimes(1);
  });

  it("respects the initial showAnswer prop", () => {
    render(<Flashcard card={mockCard} showAnswer={true} />);
    expect(
      screen.getByText("A JavaScript library for building user interfaces")
    ).toBeInTheDocument();
  });
});
