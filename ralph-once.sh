#!/bin/bash
set -e

# Ralph single iteration for quiet-notes (human-in-the-loop)
# Usage: ./ralph-once.sh

echo "Starting Ralph single iteration (interactive mode)"
echo "=========================================="

PROMPT=$(cat ralph-prompt.txt)
claude code "$PROMPT"

echo ""
echo "=========================================="
echo "Ralph iteration complete"
echo "Run ./ralph-once.sh again to do another iteration"
echo "=========================================="
