import type { Locator, Page } from "@playwright/test";

export class LoginPage {
  readonly heading: Locator;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly signInButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole("heading", { name: /sign in/i });
    this.emailField = page.getByLabel(/email/i);
    this.passwordField = page.getByLabel(/password/i);
    this.signInButton = page.getByRole("button", { name: /sign in/i });
  }

  async goto() {
    await this.page.goto("/login");
  }

  async signIn(email: string, password: string) {
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.signInButton.click();
  }
}
