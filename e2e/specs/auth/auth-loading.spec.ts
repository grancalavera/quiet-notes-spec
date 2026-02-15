import { test, expect } from "../../fixtures/index";

test("REQ-AUTH-005: loading state is displayed while determining auth status (authenticated)", async ({
  page,
  notebookPage,
}) => {
  // Navigate to the application as an authenticated user
  await page.goto("/");

  // Verify a loading indicator is displayed while authentication is being determined
  await expect(page.getByRole("status", { name: /loading/i })).toBeVisible();

  // Verify the appropriate page renders once auth status is known
  await expect(notebookPage.heading).toBeVisible();
});

test.describe("unauthenticated", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("REQ-AUTH-005: loading state is displayed while determining auth status (unauthenticated)", async ({
    page,
    loginPage,
  }) => {
    // Navigate to the application as an unauthenticated user
    await page.goto("/");

    // Verify a loading indicator is displayed while authentication is being determined
    await expect(page.getByRole("status", { name: /loading/i })).toBeVisible();

    // Verify the login page renders once auth status is known
    await expect(loginPage.heading).toBeVisible();
  });
});
