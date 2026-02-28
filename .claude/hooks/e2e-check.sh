#!/usr/bin/env bash
set -euo pipefail

INPUT=$(cat)

CWD=$(echo "$INPUT" | jq -r '.cwd // empty')
if [ -z "$CWD" ]; then
	exit 0
fi

OUTPUT=$(cd "$CWD/e2e" && pnpm exec playwright test --reporter=list 2>&1) || {
	printf 'e2e tests failed:\n%s' "$OUTPUT" >&2
	exit 2
}

exit 0
