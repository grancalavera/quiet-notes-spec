import { test, expect } from "../../fixtures/index";

// Start unauthenticated - override storageState from config
test.use({ storageState: { cookies: [], origins: [] } });

test("REQ-AUTH-007: login page provides a toggle between sign-in and sign-up modes", async ({
  loginPage,
}) => {
  // Navigate to the login page
  await loginPage.goto();

  // Verify the sign-in form is displayed by default
  await expect(loginPage.heading).toBeVisible();
  await expect(loginPage.emailField).toBeVisible();
  await expect(loginPage.passwordField).toBeVisible();
  await expect(loginPage.signInButton).toBeVisible();

  // Verify there is a visible control to switch to sign-up mode
  await expect(loginPage.switchToSignUpLink).toBeVisible();

  // Switch to sign-up mode
  await loginPage.switchToSignUp();

  // Verify the sign-up form is displayed with email, password, and password confirmation
  await expect(loginPage.signUpHeading).toBeVisible();
  await expect(loginPage.emailField).toBeVisible();
  await expect(loginPage.passwordField).toBeVisible();
  await expect(loginPage.passwordConfirmField).toBeVisible();
  await expect(loginPage.signUpButton).toBeVisible();

  // Verify there is a visible control to switch back to sign-in mode
  await expect(loginPage.switchToSignInLink).toBeVisible();

  // Switch back to sign-in mode
  await loginPage.switchToSignIn();

  // Verify the sign-in form is displayed again
  await expect(loginPage.heading).toBeVisible();
  await expect(loginPage.signInButton).toBeVisible();
});
