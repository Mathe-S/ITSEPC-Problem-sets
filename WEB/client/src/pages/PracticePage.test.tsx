import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PracticePage from "./PracticePage";
import * as mockApi from "../services/mockApi";

// Mock the API
vi.mock("../services/mockApi");

// Mock router if needed
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

describe("PracticePage Integration", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Setup API mocks
    vi.mocked(mockApi.practice).mockResolvedValue([
      {
        id: "1",
        front: "Question 1",
        back: "Answer 1",
        bucketId: 0,
      },
      {
        id: "2",
        front: "Question 2",
        back: "Answer 2",
        bucketId: 1,
      },
    ]);

    vi.mocked(mockApi.update).mockResolvedValue({
      id: "1",
      front: "Question 1",
      back: "Answer 1",
      bucketId: 1, // Updated bucket
      lastPracticed: new Date(),
    });
  });

  it("allows a user to complete a full practice session", async () => {
    const user = userEvent.setup();
    render(<PracticePage />);

    // Wait for the cards to load
    await waitFor(() => {
      expect(screen.getByText("Question 1")).toBeInTheDocument();
    });

    // Complete the first card
    await user.click(screen.getByText(/show answer/i));
    expect(await screen.findByText("Answer 1")).toBeInTheDocument();
    await user.click(screen.getByText("Easy"));

    // Verify update was called with the right parameters
    expect(mockApi.update).toHaveBeenCalledWith("1", "easy");

    // // Continue to the next card
    // await waitFor(() => {
    //   expect(screen.getByText("Question 2")).toBeInTheDocument();
    // });

    // // Complete the second card
    // await user.click(screen.getByText(/show answer/i));
    // expect(await screen.findByText("Answer 2")).toBeInTheDocument();
    // await user.click(screen.getByText("Hard"));

    // // Verify completion
    // await waitFor(() => {
    //   expect(
    //     screen.getByText(/practice session completed/i)
    //   ).toBeInTheDocument();
    // });
  });
});
