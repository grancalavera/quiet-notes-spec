import { test, expect } from "../../fixtures/index";

// Start unauthenticated - override storageState from config
test.use({ storageState: { cookies: [], origins: [] } });

test("REQ-AUTH-003: unauthenticated users are redirected to login then back to requested page", async ({
  page,
  loginPage,
  notebookPage,
}) => {
  // Try to access a protected route while unauthenticated
  await page.goto("/notebook");

  // Verify redirect to login page
  await expect(loginPage.heading).toBeVisible();
  await expect(page).toHaveURL(/\/login/);

  // Sign in with valid credentials
  await loginPage.signIn("testuser@example.com", "testpassword123");

  // Verify redirect back to the originally requested page
  await expect(notebookPage.heading).toBeVisible();
  await expect(page).toHaveURL(/\/notebook/);
});
