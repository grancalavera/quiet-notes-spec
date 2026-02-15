import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { NotebookPage } from "../pages/notebook.page";
import { HeaderComponent } from "../components/header.component";

type Fixtures = {
  loginPage: LoginPage;
  notebookPage: NotebookPage;
  header: HeaderComponent;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  notebookPage: async ({ page }, use) => {
    await use(new NotebookPage(page));
  },
  header: async ({ page }, use) => {
    await use(new HeaderComponent(page));
  },
});

export { expect };
