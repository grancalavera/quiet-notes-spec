import type { Locator, Page } from "@playwright/test";

export class NotebookPage {
  readonly heading: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole("heading", { name: /notebook/i });
  }

  async goto() {
    await this.page.goto("/notebook");
  }
}
