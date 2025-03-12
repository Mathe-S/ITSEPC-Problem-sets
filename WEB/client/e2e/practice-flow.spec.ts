import { test, expect } from "@playwright/test";

test("User can complete a practice session", async ({ page }) => {
  // Navigate to practice page
  await page.goto("/practice");

  // Verify page loaded
  await expect(
    page.getByRole("heading", { name: "Practice Session" })
  ).toBeVisible();

  // First card
  await expect(page.getByText("Question 1")).toBeVisible();
  await page.getByText("Show Answer").click();
  await expect(page.getByText("Answer 1")).toBeVisible();
  await page.getByRole("button", { name: "Easy" }).click();

  // Second card
  await expect(page.getByText("Question 2")).toBeVisible();
  await page.getByText("Show Answer").click();
  await expect(page.getByText("Answer 2")).toBeVisible();
  await page.getByRole("button", { name: "Hard" }).click();

  // Verify completion
  await expect(page.getByText("Practice Session Completed!")).toBeVisible();
});
