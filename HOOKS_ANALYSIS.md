# Hooks Analysis: ralph-prompt.txt

Analysis of which parts of `ralph-prompt.txt` could move from prompt instructions to deterministic Claude Code hooks.

## Good hook candidates

### 1. Auto-format & lint after file edits (step 7, lines 54-56)

`PostToolUse` hook on `Edit|Write` — run `pnpm format:fix && pnpm lint:fix` on changed files. This is the clearest win: it happens every time, requires no judgment, and the prompt currently mentions it twice (steps 2 and 7).

### 2. Protect test files from deletion (critical rule, line 83)

`PreToolUse` hook on `Edit|Write` — exit 2 if a file in `e2e/specs/` is being overwritten with content that removes test cases, or block `Bash` commands that `rm` spec files. "NEVER delete tests" is a hard rule, perfect for a hook.

### 3. Verify clean state on session start (step 2, lines 14-21)

`SessionStart` hook — run format/lint, run existing e2e tests, report failures as `additionalContext`. The agent still needs to fix failures, but the hook surfaces them automatically instead of relying on the LLM to remember to check.

### 4. Type-check and Docker health on Stop (step 6, lines 49-53)

`Stop` hook (prompt or agent-based) — before the agent finishes an iteration, verify `pnpm type-check` passes and `docker ps` shows healthy containers. If not, block the stop with a reason. This enforces the "verify before committing" gate.

### 5. Check completion on Stop (step 11, lines 75-78)

`Stop` hook — parse `requirements.json`, check if all have `"passes": true`. If so, inject `PROMISE_COMPLETE` context. This is pure data inspection with no judgment needed.

## Borderline — could go either way

### 6. Run the new test before and after implementation (steps 4, 6)

A `Stop` hook could verify that the test suite passes before allowing the agent to finish. But deciding *which* test to run and interpreting "it should fail first, then pass" is judgment work that belongs in the prompt.

## Should stay in the prompt

- **Read context** (step 1) — requires comprehension
- **Pick one requirement** (step 3) — requires prioritization judgment
- **Write test first** (step 4) — creative work
- **Implement the feature** (step 5) — creative work
- **Update requirements.json** (step 8) — needs to know which one passed
- **Update progress.txt** (step 9) — needs to summarize learnings
- **Commit** (step 10) — needs to compose the message

## Summary

The prompt could shed ~30% of its content by moving the mechanical guardrails (format/lint, test protection, health checks, completion detection) into hooks. What remains would be purely about the *thinking* work: read context, pick a requirement, write a test, implement, update state, commit.
