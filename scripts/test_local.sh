#!/usr/bin/env bash
#
# Installs deps, builds the extension and launches a VS Code Extension
# Development Host window with it loaded, ready to test.
#
# Example:
#   ./scripts/test_local.sh

set -e

step() {
  printf '\033[36m==> %s\033[0m\n' "$1"
}

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"

step "Installing dependencies"
npm install

step "Building (keybindings + extension bundle)"
npm run build

step "Launching Extension Development Host"
code --extensionDevelopmentPath="$root" --new-window
