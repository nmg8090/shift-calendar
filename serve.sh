#!/bin/bash
set -euo pipefail

PORT=${1:-8000}
WORKDIR="$(cd "$(dirname "$0")" && pwd)"
cd "$WORKDIR"

echo "Serving shift-calendar from $WORKDIR"

if command -v npx >/dev/null 2>&1; then
  echo "Starting live server on http://0.0.0.0:$PORT/index.html"
  npx live-server --port=$PORT --host=0.0.0.0 --no-browser
else
  echo "Starting python server on http://0.0.0.0:$PORT/index.html"
  python3 -m http.server "$PORT" --bind 0.0.0.0
fi
