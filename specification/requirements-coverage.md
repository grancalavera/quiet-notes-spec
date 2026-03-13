# Requirements Coverage Checklist

This document tracks which areas of the Quiet Notes application have been reverse-engineered into `requirements.json`.

## Feature Areas

### Authentication

- [x] OAuth sign-in (Google popup)
- [x] Sign-out with session cleanup
- [x] Redirect unauthenticated users to login
- [x] Redirect authenticated users away from login
- [x] Loading state during auth initialization
- [x] Auth state persistence across page refreshes

### Authorization / Roles

- [x] Three roles: user, author, admin
- [x] Default role assignment (user)
- [x] Bootstrap admin mechanism
- [x] Route protection by role (author for notebook, admin for admin panel)
- [x] Lobby for users without author role
- [x] Lobby redirects based on roles
- [x] Admin features hidden from non-admins
- [x] Server-side role verification
- [x] Client-side role checks for UI gating

### Security Rules / Data Access

- [x] Notes: author-only read/update/delete, any authenticated create
- [x] Settings: user-scoped read/write, any authenticated create
- [x] Users collection: admin read all, user read own, admin-only update
- [x] Roles-updates: admin reads global, user reads own
- [x] Server functions verify admin before privileged operations
- [x] Unauthenticated request handling
- [x] Permission-denied error handling

### User Onboarding

- [x] New user triggers automatic onboarding
- [x] Default role assignment (user)
- [x] Bootstrap admin detection via environment variable
- [x] Lobby "application being reviewed" message
- [x] Automatic redirect from lobby when roles granted

### Note Management

- [x] Create new empty note
- [x] Note title derived from first line of content
- [x] Edit note content (plain text)
- [x] Auto-save with 2-second throttle
- [x] Delete note
- [x] Duplicate note with "copy of" prefix
- [x] Notes list shows title, created date, updated date
- [x] Note data model (id, content, author, clock, version, createdAt, updatedAt)
- [x] Server-side timestamps
- [x] Version increment on save
- [x] Creating note opens it in editor
- [x] Duplicating note opens copy in editor
- [x] Deleting open note closes editor

### Note Sorting

- [x] Sort by created date (newest first) - default
- [x] Sort by created date (oldest first)
- [x] Sort by title A-Z
- [x] Sort by title Z-A
- [x] Sort selection persists during session

### Editor

- [x] Plain text textarea
- [x] Editor toolbar with title
- [x] Toolbar duplicate and split buttons
- [x] Clicking note opens in active editor
- [x] Selected note highlighted in list
- [x] Active editor visual indicator (border)

### Split Editor (Desktop Only)

- [x] "Send to additional editor" button
- [x] Side-by-side 50/50 layout
- [x] Each editor can show different note
- [x] Note list opens in selected editor
- [x] Close button on additional editor
- [x] Disabled when same note already in additional
- [x] Auto-closes on mobile/tablet viewport

### Admin Panel (Desktop Only)

- [x] Accessible via settings icon (admin + desktop)
- [x] User table with all columns
- [x] Toggle author role
- [x] Toggle admin role
- [x] Server-side role change via function call
- [x] Not accessible on mobile
- [x] Non-admin redirect

### User Profile

- [x] Profile avatar button in header
- [x] Popover with avatar, name, email, UID
- [x] Sign Out button
- [x] Sign out triggers page reload

### Theme / Settings

- [x] Light/dark toggle switch
- [x] Theme persisted to server per user
- [x] Theme loaded on app initialization
- [x] Default theme (light)
- [x] Sun/moon icons on toggle

### Responsive Design

- [x] Mobile breakpoint (max-width 600px)
- [x] Tablet breakpoint (max-width 900px)
- [x] Desktop breakpoint (min-width 900px)
- [x] Desktop 3-pane layout (sidebar + notes list + editor)
- [x] Mobile layout with drawer
- [x] Mobile: no admin route
- [x] Mobile: no split editor
- [x] Tablet: header icons scale down
- [x] Platform detection (TargetPlatform)

### Real-time Sync

- [x] Notes sync in real-time across clients
- [x] Optimistic local updates
- [x] CRDT vector clock conflict resolution
- [x] Notes collection real-time updates
- [x] Throttled auto-save

### PWA

- [x] Installable PWA (manifest)
- [x] Service worker caching
- [x] Update prompt (snackbar)
- [x] User-initiated update
- [x] Multiple icon sizes
- [x] Apple touch icons

### Navigation & App Shell

- [x] Logo "Qn." links to home
- [x] GitHub link in header
- [x] Header always visible (pancake stack layout)
- [x] Full viewport layout

### Error Handling

- [x] Error state captures errors
- [x] Permission denied errors handled
- [x] Error dismiss capability
- [x] Async errors propagated to global state

## Source Files Reviewed

| Category   | Files                                                                                                                                                                   |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth       | `auth-service.ts`, `auth.tsx`, `auth-state.ts`, `auth-service-model.ts`, `auth-service-schema.ts`                                                                       |
| Routes     | `application.tsx`, `Desktop.tsx`, `Mobile.tsx`, `target-platform.tsx`, `Lobby.tsx`, `Notebook.tsx`, `NotebookMobile.tsx`, `NoteEditor.tsx`, `Admin.tsx`                 |
| Notebook   | `notebook-service.ts`, `notebook-state.ts`, `notes-collection-state.ts`, `notebook-model.ts`, `notebook-notes-list.tsx`, `notebook-notes-list-item.tsx`, `notebook.tsx` |
| Note       | `note-state.ts`, `note-editor.tsx`, `note-editor-layout.tsx`, `note-split-agent.tsx`                                                                                    |
| Admin      | `admin.tsx`, `admin-state.ts`, `admin-service-schema.ts`, `admin-service.ts`                                                                                            |
| Settings   | `settings-state.ts`, `settings-model.ts`, `settings-service.ts`, `settings-service-model.ts`                                                                            |
| Theme      | `app-theme.tsx`, `toggle-theme-switch.tsx`                                                                                                                              |
| Security   | `firestore.rules`, `storage.rules`                                                                                                                                      |
| Functions  | `index.ts`, `lib.ts`                                                                                                                                                    |
| App Shell  | `app-header.tsx`, `app-secure-shell.tsx`, `app-error-state.ts`, `app-error.ts`, `app-error-boundary.tsx`                                                                |
| Platform   | `devices.ts`, `target-platform.tsx`                                                                                                                                     |
| PWA        | `vite.config.ts`, `reload-prompt.tsx`                                                                                                                                   |
| Shared Lib | `user.ts`, `settings.ts`, `theme.ts`                                                                                                                                    |
| Toolbars   | `notebook-list-toolbar.tsx`, `notebook-sort-menu.tsx`, `create-note-button.tsx`, `delete-note-button.tsx`, `duplicate-note-button.tsx`                                  |

## Screenshots Cross-Referenced

| Screenshot                     | Requirements Covered                    |
| ------------------------------ | --------------------------------------- |
| `01-login-page.png`            | REQ-AUTH-001                            |
| `02-notebook-empty.png`        | REQ-NOTE-001, REQ-RESPONSIVE-004        |
| `03-note-created.png`          | REQ-NOTE-001, REQ-NOTE-002              |
| `04-note-with-content.png`     | REQ-NOTE-003, REQ-NOTE-002              |
| `05-multiple-notes.png`        | REQ-NOTE-007, REQ-EDIT-004              |
| `06-split-editor.png`          | REQ-SPLIT-001, REQ-SPLIT-002            |
| `07-split-different-notes.png` | REQ-SPLIT-003                           |
| `08-dark-mode.png`             | REQ-THEME-001                           |
| `09-sort-menu.png`             | REQ-SORT-001 through REQ-SORT-004       |
| `10-profile-popover.png`       | REQ-PROFILE-001 through REQ-PROFILE-004 |
| `11-admin-panel.png`           | REQ-ADMIN-001 through REQ-ADMIN-004     |
| `12-duplicate-note.png`        | REQ-NOTE-006                            |
| `13-mobile-drawer-open.png`    | REQ-RESPONSIVE-005                      |
| `14-mobile-notes-list.png`     | REQ-RESPONSIVE-005                      |
