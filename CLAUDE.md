# quiet-notes

## Architecture

- **Backend:** PocketBase (https://pocketbase.io/)
- **Auth:** Username/password only
- **Deployment:** All local, Docker
- **Realtime:** PocketBase realtime subscriptions for live note updates across clients
- **Frontend:** Latest Vite with React and TypeScript
- **Package manager:** pnpm
- **PocketBase admin UI:** http://localhost:8090/_/
- **Client UI:** http://localhost:5173/

Run `./check-env.sh` to verify the dev environment is up before running tests or doing work.

Read `progress.txt` and recent git log to understand current state before doing any work. Update `progress.txt` at the end of each session with what was accomplished.

## Git Commit Messages

### Multiline Commits

Use direct multiline strings in the `-m` flag. **Do not use heredocs** — they fail in sandbox due to temp file restrictions.

**✅ Correct:**

```bash
git commit -m "Short summary

Detailed explanation with multiple paragraphs.
Can include lists, context, etc.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

**❌ Incorrect (fails in sandbox):**

```bash
git commit -m "$(cat <<'EOF'
Message
EOF
)"
```

The heredoc approach attempts to create a temp file, which the sandbox blocks with:
`operation not permitted`

## Ralph Loop Protocol

This project uses the **Ralph loop pattern** for systematic requirement implementation. Ralph is a bash loop that runs Claude Code iteratively until all requirements pass.

### Quick Start

**Single iteration (human-in-the-loop):**

```bash
./ralph-once.sh
```

**Automated loop (run multiple iterations):**

```bash
./ralph.sh 10  # Run max 10 iterations
```

### How It Works

Each Ralph iteration follows this workflow:

1. **Read context** - Check `specification/requirements.json` and `progress.txt`
2. **Pick ONE requirement** - Choose highest priority incomplete requirement
3. **Write test FIRST** - Create failing test that verifies the requirement
4. **Implement** - Write minimal code to make test pass
5. **Verify** - Run tests, type-check, verify Docker health
6. **Update requirements.json** - Mark requirement as `"passes": true`
7. **Update progress log** - Append learnings to `progress.txt`
8. **Commit** - Create git commit with requirement ID
9. **Check completion** - If all requirements pass, output `PROMISE_COMPLETE`

### Critical Rules

- ✅ Work on EXACTLY ONE requirement per iteration
- ✅ Write the test BEFORE implementing (test-first)
- ✅ Only mark `"passes": true` if test actually passes
- ✅ Append to `progress.txt` (never overwrite)
- ✅ Each iteration = one git commit

### Files

- `specification/requirements.json` - Source of truth for all requirements
- `progress.txt` - Agent memory across iterations
- `ralph.sh` - Automated loop script
- `ralph-once.sh` - Single iteration for debugging/steering
- `ralph-prompt.txt` - Shared prompt used by both scripts

## Specification

The requirements specification lives in `specification/`. See `specification/CLAUDE.md` for guidelines on writing requirements.

## Playwright TDD

### Locator Strategy

Use this priority order. Always prefer the highest available option:

1. `getByRole()` — buttons, links, headings, textboxes, checkboxes
2. `getByLabel()` — form fields with labels
3. `getByText()` — visible text content (use `{ exact: true }` when ambiguous)
4. `getByTestId()` — fallback when no semantic role or label exists
5. CSS selector — last resort, must include a comment explaining why

```ts
// GOOD
page.getByRole("button", { name: "Sign Out" });
page.getByLabel("Password");
page.getByTestId("note-card");

// BAD — never use CSS when a role/label exists
page.locator(".btn-signout");
page.locator("#password-input");
```

### File Organization

```
e2e/
  fixtures/
    index.ts                    # Combined fixture export (the single test import)
    auth.setup.ts               # Auth storageState setup
  pages/
    login.page.ts               # One file per page/view
    notebook.page.ts
  components/
    header.component.ts         # Shared UI that appears on multiple pages
  specs/
    auth/
      auth-sign-in.spec.ts      # Group specs by category
    notes/
      note-create.spec.ts
  .auth/                        # gitignored — storageState JSON files
  playwright.config.ts
```

- Spec filenames: `{category}-{topic}.spec.ts`
- Page object filenames: `{page-name}.page.ts`
- Component object filenames: `{component-name}.component.ts`

### Page Objects

Locators as readonly properties. User actions as async methods. No assertions.

```ts
import type { Locator, Page } from "@playwright/test";

export class NotebookPage {
  readonly createNoteButton: Locator;
  readonly notesList: Locator;

  constructor(private readonly page: Page) {
    this.createNoteButton = page.getByRole("button", { name: /create note/i });
    this.notesList = page.getByRole("list", { name: /notes/i });
  }

  async goto() {
    await this.page.goto("/notebook");
  }

  async createNote() {
    await this.createNoteButton.click();
  }

  noteCard(title: string): Locator {
    return this.notesList.getByRole("listitem").filter({ hasText: title });
  }
}
```

Rules:

- Constructor takes `Page` (or `Locator` for components)
- No assertions in page objects — assertions belong in tests only
- No inheritance hierarchies — compose with component objects instead
- Keep methods at user-intent level (`createNote()`) not granular clicks

### Component Objects

For shared UI (header, editor) that appears on multiple pages. Scoped to a parent locator:

```ts
import type { Locator, Page } from "@playwright/test";

export class HeaderComponent {
  readonly themeToggle: Locator;
  readonly profileButton: Locator;

  constructor(page: Page) {
    const header = page.getByRole("banner");
    this.themeToggle = header.getByRole("switch", { name: /theme/i });
    this.profileButton = header.getByRole("button", { name: /profile/i });
  }
}
```

### Fixtures

All spec files import `test` and `expect` from `e2e/fixtures/index.ts`, never from `@playwright/test` directly.

```ts
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
```

- Fixtures instantiate page objects — that is their primary job
- Fixtures may navigate but must not assert

### Authentication

Three roles (user, author, admin) each get a `storageState` JSON file in `e2e/.auth/`. Auth setup uses the PocketBase API directly (`request.post`) — not the browser login UI.

Config defines per-role projects with `dependencies: ["setup"]`. Unauthenticated tests override with `{ storageState: { cookies: [], origins: [] } }`.

### Responsive Testing

- **Mobile:** `devices["Pixel 5"]`
- **Tablet:** `{ width: 768, height: 1024 }`
- **Desktop:** `devices["Desktop Chrome"]`

Viewport-specific tests use `test.skip()` annotations:

```ts
test("REQ-RESPONSIVE-005: mobile editor drawer", async ({ notebookPage }) => {
  test.skip(test.info().project.name !== "mobile", "mobile only");
});
```

### Multi-Client Testing

For sync requirements, create additional browser contexts within the test:

```ts
test("REQ-SYNC-001: notes sync across clients", async ({ browser }) => {
  const ctxA = await browser.newContext({
    storageState: "e2e/.auth/author.json",
  });
  const ctxB = await browser.newContext({
    storageState: "e2e/.auth/author.json",
  });
  const pageA = await ctxA.newPage();
  const pageB = await ctxB.newPage();
  // ... test sync behavior, then close both contexts
});
```

### Test Naming

Test titles MUST include the requirement ID:

```ts
test("REQ-AUTH-002: users can sign out", async ({ loginPage }) => {
  // ...
});
```

### Anti-Patterns

- No `page.waitForTimeout()` — use auto-retrying assertions (`toBeVisible`, `toHaveText`)
- No CSS selectors when a role/label/testid locator works
- No assertions in page objects or fixtures
- No hardcoded absolute URLs — use `baseURL` from config + relative paths
- No `import { test } from '@playwright/test'` in spec files — always import from `e2e/fixtures/index.ts`
- No page object inheritance — compose with component objects
- No XPath selectors

### Locator Maintenance

When the UI changes and locators break:

- ✅ **Fix the locator** in the Page Object or Component Object where it's defined
- ✅ **Keep the test unchanged** — assertions and test logic remain permanent
- ❌ **NEVER modify the test** to work around a broken locator
- ❌ **NEVER delete the test** because a locator broke

This separation means:

- **Tests are permanent documentation** of requirements — they never change
- **Locators are implementation details** that evolve with the UI
- **One locator fix updates all tests** that use that page object
- **Test assertions are sacred** — if a test fails, either fix the code or fix the locator, never the test
