#!/usr/bin/env bash
set -e
NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
VERSION="$(tr -d '[:space:]' < .nvmrc)"
NODE_BIN="$NVM_DIR/versions/node/v$VERSION/bin"
if [ ! -x "$NODE_BIN/node" ]; then
  echo "[use-node] node v$VERSION not installed at $NODE_BIN; run: nvm install $VERSION" >&2
  exit 1
fi
export PATH="$NODE_BIN:$PATH"
# Hand off to the real command (umirs args from caller)
exec "$@"
