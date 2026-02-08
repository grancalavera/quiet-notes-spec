# quiet-notes

## Architecture

- **Backend:** PocketBase (https://pocketbase.io/)
- **Auth:** Username/password only
- **Deployment:** All local, Docker
- **Realtime:** PocketBase realtime subscriptions for live note updates across clients
- **Frontend:** Latest Vite with React and TypeScript

## Specification

The requirements specification lives in `specification/`. See `specification/CLAUDE.md` for guidelines on writing requirements.

To validate requirements:

```bash
cd specification && pnpm install && pnpm validate
```
