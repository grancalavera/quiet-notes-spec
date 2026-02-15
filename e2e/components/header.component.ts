import type { Locator, Page } from "@playwright/test";

export class HeaderComponent {
  readonly profileAvatarButton: Locator;
  readonly signOutButton: Locator;

  constructor(page: Page) {
    const header = page.getByRole("banner");
    this.profileAvatarButton = header.getByRole("button", { name: /profile/i });
    this.signOutButton = page.getByRole("button", { name: /sign out/i });
  }

  async openProfileMenu() {
    await this.profileAvatarButton.click();
  }

  async signOut() {
    await this.openProfileMenu();
    await this.signOutButton.click();
  }
}
