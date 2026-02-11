import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { NotebookPage } from "../pages/notebook.page";

type Fixtures = {
  loginPage: LoginPage;
  notebookPage: NotebookPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  notebookPage: async ({ page }, use) => {
    await use(new NotebookPage(page));
  },
});

export { expect };
