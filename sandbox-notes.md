# Sandbox + Playwright on macOS: What Works, What Doesn't

## Goal

Allow Claude Code to work autonomously with sandbox enabled — restricting filesystem writes to the project directory and network access to an explicit domain allowlist — while still being able to run Playwright e2e tests and use `playwright-cli` for interactive browser testing.

## The Blocker: Mach Ports and Seatbelt

Claude Code's sandbox on macOS uses **Seatbelt**, the OS kernel-level sandboxing system. Seatbelt wraps every bash command in a profile that restricts file access, network, and system calls.

Chromium (used by Playwright) runs as multiple processes — main process, tab processes, GPU, networking. These processes communicate via **Mach ports**: kernel-managed IPC channels (not network ports). On startup, Chromium registers a `MachPortRendezvousServer` so child processes can find the parent. This registration uses the `bootstrap_check_in` system call, which Seatbelt blocks.

**This is not configurable.** The Seatbelt profile used by Claude Code does not allow `bootstrap_check_in`. No Playwright or Chromium setting can work around it:

- `--no-sandbox` / `chromiumSandbox: false` — disables Chromium's own internal sandbox, not Seatbelt
- `PLAYWRIGHT_MCP_NO_SANDBOX` — same, only affects Chromium's sandbox
- `userDataDir` / `--profile` — fixes file permission errors but not Mach port registration
- `excludedCommands` — only matches the literal binary name (first token), so `npx playwright-cli` or `pnpm exec playwright` don't match because the binary is `npx`/`pnpm`

**Result:** Any command that launches Chromium inside the sandbox will fail on macOS with:
```
FATAL: bootstrap_check_in org.chromium.Chromium.MachPortRendezvousServer: Permission denied (1100)
```

## What Works: The Hook Approach

Hooks run outside the sandbox with the user's full system permissions. A `Stop` hook runs after every Claude response and feeds test results back if they fail.

### How it works

1. Claude writes/edits code (sandboxed)
2. Claude finishes responding → `Stop` hook fires
3. Hook runs `pnpm exec playwright test` outside the sandbox → Chromium launches fine
4. Tests pass → exit 0 (silent, Claude stops normally)
5. Tests fail → exit 2 with test output on stderr → Claude sees the failures and keeps working

### Files

- `.claude/hooks/e2e-check.sh` — the hook script
- `.claude/settings.json` — sandbox config + hook registration

### Limitations

- Claude **cannot run Playwright interactively** while sandboxed (no `playwright-cli open`, no browser snapshots during development)
- The hook only runs the full test suite on stop — no selective test runs or interactive browser verification mid-turn
- If the dev environment (Docker) isn't running, the hook will fail with connection errors rather than sandbox errors

