# quiet-notes

## Architecture

- **Backend:** PocketBase (https://pocketbase.io/)
- **Auth:** Username/password only
- **Deployment:** All local, Docker
- **Realtime:** PocketBase realtime subscriptions for live note updates across clients
- **Frontend:** Latest Vite with React and TypeScript

## Session Bootstrap

Every agent session MUST begin by running the bootstrap script:

```bash
./init.sh
```

This script:
1. Disables commit signing (no GPG key in agent sessions)
2. Verifies Docker is running
3. Builds and starts all services via `docker compose up --build -d`
4. Waits for PocketBase and Vite to be healthy
5. Runs a smoke test (echo round-trip)

After bootstrap, read `progress.txt` and recent git log to understand current state before doing any work. Update `progress.txt` at the end of each session with what was accomplished.

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

To validate requirements:

```bash
cd specification && pnpm install && pnpm validate
```
