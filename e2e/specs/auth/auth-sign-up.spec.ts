import { test, expect } from "../../fixtures/index";

// Start unauthenticated - override storageState from config
test.use({ storageState: { cookies: [], origins: [] } });

test("REQ-AUTH-008: users can create a new account and are automatically signed in", async ({
  page,
  loginPage,
  notebookPage,
}) => {
  // Generate a unique email to avoid conflicts across test runs
  const uniqueEmail = `signup-${Date.now()}@example.com`;
  const password = "testpassword123";

  // Navigate to the login page
  await loginPage.goto();

  // Switch to sign-up mode
  await loginPage.switchToSignUp();
  await expect(loginPage.signUpHeading).toBeVisible();

  // Fill in and submit the sign-up form
  await loginPage.signUp(uniqueEmail, password);

  // Verify the user is automatically signed in and redirected to the home page
  await expect(notebookPage.heading).toBeVisible();
  await expect(page).toHaveURL(/\/notebook/);
});
