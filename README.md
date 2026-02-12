# quiet notes by specification

Re-writing [notes.quiet.works](https://notes.quiet.works) from scratch, driven entirely by a machine-readable specification. An autonomous coding agent (Claude Code) iterates through requirements one by one using the Ralph loop pattern, writing tests first and implementing until all requirements pass.

## Reference material

- **[Enabling Claude Code to work more autonomously](https://www.anthropic.com/news/enabling-claude-code-to-work-more-autonomously)** — Announces Claude Code features for autonomous work: checkpoints for safe rollback, subagents for parallel tasks, hooks for automated testing/linting, and background task support.

- **[Effective harnesses for long running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)** — Anthropic's guide to keeping agents productive across multiple context windows. Key ideas: track requirements in structured JSON (not markdown), maintain a progress log as agent memory, work on one feature at a time, commit after each, and use browser automation for end-to-end verification.

- **[Matt Pocock's Ralph loop version](./docs/matt-pocock-ralph-loop.txt)** — Video transcript where Matt Pocock explains the Ralph loop: a bash for-loop that repeatedly invokes a coding agent against a JSON requirements list. Each iteration picks one task, implements it, runs type checks and tests, updates progress, and commits. Simpler and more flexible than multi-phase plans.

- **[Claude Code Agent Teams](https://code.claude.com/docs/en/agent-teams)** — Experimental feature for coordinating multiple Claude Code instances as a team. A lead session spawns teammates that work in parallel with their own context windows, communicate via messaging, and share a task list. Best for parallel code review, competing-hypothesis debugging, and cross-layer feature work.

- **[Claude Code Sandboxing](https://code.claude.com/docs/en/sandboxing)** — OS-level filesystem and network isolation for Claude Code's bash commands. Uses macOS Seatbelt or Linux bubblewrap to restrict file writes to the working directory and limit network access to approved domains, reducing permission prompts while protecting against prompt injection and data exfiltration.
