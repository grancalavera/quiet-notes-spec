# quiet-notes-requirements

## What Makes a Good Requirement

A requirement describes **what the system does for users** and **what guarantees it provides**, not **how it is built**.

### Describe behavior, not implementation

- "Users can sign in with a third-party identity provider" — not "Users sign in via OAuth popup with Google using Firebase Auth"
- "Changes are auto-saved after a short idle period" — not "Changes are saved with a 2-second throttle using RxJS"
- "Concurrent edits are resolved without data loss" — not "Concurrent edits use CRDT vector clocks"

### Describe outcomes, not mechanisms

- "The session is cleared and the user returns to the login page" — not "The page reloads"
- "The user's role is verified server-side before executing the operation" — not "The toggleRole Cloud Function checks customClaims"
- "The user's profile is persisted" — not "A user record is projected to the users collection"

### Describe structure, not CSS

- "The layout has a sidebar and an editor area, with the sidebar narrower" — not "CSS Grid with template areas sidebar-toolbar, sidebar, editor and a 300px column"
- "The header stays visible while body content scrolls" — not "Pancake stack layout"
- "Header icons are visually reduced at tablet sizes" — not "Scaled to 70%"

### Describe accessibility and interaction, not HTML

- "The editor is an accessible plain-text editing area" — not "The editor is a textarea with aria-label 'a quiet note'"
- "The profile popover shows the user's name, email, and ID" — not "Name in bold, email in italic, UID in italic"

### Describe data semantics, not field names

- "Each note tracks its content, author, version, and timestamps" — not "Fields: id, content, author, clock, \_version, \_createdAt, \_updatedAt"
- "The system tracks roles per user" — not "The user data model includes a customClaims.roles array"

### Describe constraints, not constants

- "The note tracks a version that increments on each save" — not "The initial version is 0"
- "The app provides icons at standard PWA sizes" — not "Icons at 192x192, 256x256, 384x384, 512x512"
- "The UI adapts across mobile, tablet, and desktop breakpoints" — not "Mobile at 600px, tablet at 900px"

### Keep backend and infrastructure concerns out of requirements

Requirements should not mention:

- Specific database technologies or document paths (Firestore, collections, document IDs)
- Specific auth mechanisms (custom claims, OAuth popup vs redirect)
- Specific server-side constructs (Cloud Functions, server timestamps, environment variables)
- Specific frontend frameworks or libraries (React component trees, RxJS, CSS Grid)
- Specific conflict resolution algorithms (CRDT, vector clocks)

These belong in architecture or design documents, not in the requirements specification.

### A requirement should be testable without knowing the implementation

If a test step can only be verified by inspecting internal state (database fields, custom claims, component trees), it belongs in a technical spec, not a requirement. Requirement steps should be verifiable through user-observable behavior or system-level guarantees (API contracts, access control outcomes).

## Validation

Requirements are validated with a TypeScript schema (Zod) via:

```bash
pnpm validate
```

This checks:

- All requirements match the expected schema (id pattern, non-empty fields, `passes: false`)
- All requirement IDs are unique

Always run `pnpm validate` after editing `requirements.json`.
