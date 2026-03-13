import { test, expect } from "../../fixtures/index";

// Start unauthenticated - override storageState from config
test.use({ storageState: { cookies: [], origins: [] } });

test("REQ-AUTH-001: users can sign in", async ({
  page,
  loginPage,
  notebookPage,
}) => {
  // Navigate to the application while unauthenticated
  await page.goto("/");

  // Verify the login page is displayed with a sign-in button
  await expect(loginPage.heading).toBeVisible();
  await expect(loginPage.signInButton).toBeVisible();

  // Complete the authentication flow
  await loginPage.signIn("testuser@example.com", "testpassword123");

  // Verify the user is redirected to the notebook page after successful sign-in
  await expect(notebookPage.heading).toBeVisible();
});
