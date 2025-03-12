import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PracticeSession from "./PracticeSession";
import * as mockApi from "../../services/mockApi";

// Mock the entire API module
vi.mock("../../services/mockApi");

describe("PracticeSession", () => {
  beforeEach(() => {
    // Reset mocks between tests
    vi.resetAllMocks();

    // Setup mock implementations
    vi.mocked(mockApi.practice).mockResolvedValue([
      {
        id: "1",
        front: "Test Question",
        back: "Test Answer",
        bucketId: 1,
        lastPracticed: new Date(),
      },
    ]);

    vi.mocked(mockApi.update).mockResolvedValue({
      id: "1",
      front: "Test Question",
      back: "Test Answer",
      bucketId: 2, // Updated bucket
      lastPracticed: new Date(),
    });
  });

  it("fetches and displays cards on mount", async () => {
    render(<PracticeSession />);

    // Test loading state first
    expect(screen.getByText(/loading practice session/i)).toBeInTheDocument();

    // Test loaded content
    await waitFor(() => {
      expect(screen.getByText("Test Question")).toBeInTheDocument();
    });

    expect(mockApi.practice).toHaveBeenCalledTimes(1);
  });

  it("updates a card when a difficulty is selected", async () => {
    const user = userEvent.setup();
    render(<PracticeSession />);

    // Wait for cards to load
    await waitFor(() => {
      expect(screen.getByText("Test Question")).toBeInTheDocument();
    });

    // Flip card to show answer
    await user.click(screen.getByText(/show answer/i));

    // Select difficulty
    await user.click(screen.getByText("Easy"));

    // Verify API was called correctly
    expect(mockApi.update).toHaveBeenCalledWith("1", "easy");
  });
});
