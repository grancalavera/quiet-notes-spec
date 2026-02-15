import { test, expect } from "../../fixtures/index";

test("REQ-AUTH-002: users can sign out", async ({
  page,
  header,
  loginPage,
  notebookPage,
}) => {
  // Start on the notebook page as an authenticated user (storageState provides auth)
  await page.goto("/notebook");
  await expect(notebookPage.heading).toBeVisible();

  // Click the profile avatar button and then sign out
  await header.signOut();

  // Verify the user is returned to the login page
  await expect(loginPage.heading).toBeVisible();
  await expect(page).toHaveURL(/\/login/);

  // Verify the session is cleared by trying to access a protected route
  await page.goto("/notebook");
  await expect(loginPage.heading).toBeVisible();
  await expect(page).toHaveURL(/\/login/);
});
