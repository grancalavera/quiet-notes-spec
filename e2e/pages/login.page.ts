import type { Locator, Page } from "@playwright/test";

export class LoginPage {
  readonly heading: Locator;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly signInButton: Locator;

  // Sign-up mode
  readonly signUpHeading: Locator;
  readonly passwordConfirmField: Locator;
  readonly signUpButton: Locator;

  // Mode toggle controls
  readonly switchToSignUpLink: Locator;
  readonly switchToSignInLink: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole("heading", { name: /sign in/i });
    this.emailField = page.getByLabel(/email/i);
    this.passwordField = page.getByLabel(/^password$/i);
    this.signInButton = page.getByRole("button", { name: /sign in/i });

    // Sign-up mode
    this.signUpHeading = page.getByRole("heading", { name: /sign up/i });
    this.passwordConfirmField = page.getByLabel(/confirm password/i);
    this.signUpButton = page.getByRole("button", { name: /sign up/i });

    // Mode toggle controls
    this.switchToSignUpLink = page.getByRole("link", { name: /sign up/i });
    this.switchToSignInLink = page.getByRole("link", { name: /sign in/i });
  }

  async goto() {
    await this.page.goto("/login");
  }

  async signIn(email: string, password: string) {
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.signInButton.click();
  }

  async switchToSignUp() {
    await this.switchToSignUpLink.click();
  }

  async switchToSignIn() {
    await this.switchToSignInLink.click();
  }

  async signUp(email: string, password: string) {
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.passwordConfirmField.fill(password);
    await this.signUpButton.click();
  }
}
