#!/bin/bash
set -e

# Ralph loop for quiet-notes
# Usage: ./ralph.sh 10  (run max 10 iterations)

if [ -z "$1" ]; then
  echo "Error: Please specify max iterations"
  echo "Usage: ./ralph.sh <max_iterations>"
  echo "Example: ./ralph.sh 10"
  exit 1
fi

MAX_ITERATIONS=$1

echo "Starting Ralph loop with max $MAX_ITERATIONS iterations"
echo "=========================================="

for i in $(seq 1 $MAX_ITERATIONS); do
  echo ""
  echo "=========================================="
  echo "Ralph iteration $i of $MAX_ITERATIONS"
  echo "=========================================="

  PROMPT=$(cat ralph-prompt.txt)
  OUTPUT=$(claude "$PROMPT" 2>&1 || true)

  echo "$OUTPUT"

  # Check if agent reported completion
  if echo "$OUTPUT" | grep -q "PROMISE_COMPLETE"; then
    echo ""
    echo "=========================================="
    echo "Ralph loop complete! All requirements pass."
    echo "=========================================="
    exit 0
  fi
done

echo ""
echo "=========================================="
echo "Max iterations ($MAX_ITERATIONS) reached"
echo "Check specification/requirements.json to see progress"
echo "=========================================="
