import { test, expect } from "../../fixtures/index";

test("REQ-AUTH-004: authenticated users are redirected away from the login page", async ({
  page,
  notebookPage,
}) => {
  // Navigate to the login page as an authenticated user (storageState provides auth)
  await page.goto("/login");

  // Verify the user is redirected to the home page (notebook)
  await expect(notebookPage.heading).toBeVisible();
  await expect(page).toHaveURL(/\/notebook/);
});
