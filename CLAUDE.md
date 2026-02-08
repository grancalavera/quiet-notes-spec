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

After bootstrap, read `claude-progress.txt` and recent git log to understand current state before doing any work. Update `claude-progress.txt` at the end of each session with what was accomplished.

## Specification

The requirements specification lives in `specification/`. See `specification/CLAUDE.md` for guidelines on writing requirements.

To validate requirements:

```bash
cd specification && pnpm install && pnpm validate
```
