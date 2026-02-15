import { test, expect } from "../../fixtures/index";

test("REQ-AUTH-006: authentication state persists across page refreshes", async ({
  page,
  notebookPage,
}) => {
  // Navigate to the notebook as an authenticated user (storageState provides auth)
  await page.goto("/notebook");
  await expect(notebookPage.heading).toBeVisible();

  // Refresh the page
  await page.reload();

  // Verify the user remains authenticated and sees the notebook page
  await expect(notebookPage.heading).toBeVisible();
  await expect(page).toHaveURL(/\/notebook/);
});
