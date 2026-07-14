#!/usr/bin/env bash
#
# Builds, commits, packages and (optionally) publishes the extension.
#
# Usage:
#   ./scripts/publish.sh -m "Add debug shortcuts"
#   Builds, bumps patch version, commits, and creates a .vsix. Does not push or publish.
#
#   ./scripts/publish.sh -m "Add debug shortcuts" -b minor -p -P
#   Same, but also pushes to the remote and publishes to the Marketplace.
#
# Options:
#   -m <message>   Commit message (required)
#   -b <bump>      patch|minor|major|none (default: patch)
#   -p             Push to the remote after committing
#   -P             Publish to the VS Code Marketplace (requires 'vsce login')
#   -h             Show this help

set -e

step() {
  printf '\033[36m==> %s\033[0m\n' "$1"
}

warn() {
  printf '\033[33m%s\033[0m\n' "$1"
}

usage() {
  sed -n '2,17p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
  exit 1
}

message=""
bump="patch"
push=false
publish=false

while getopts ":m:b:pPh" opt; do
  case "$opt" in
    m) message="$OPTARG" ;;
    b) bump="$OPTARG" ;;
    p) push=true ;;
    P) publish=true ;;
    h) usage ;;
    \?) echo "Unknown option: -$OPTARG" >&2; usage ;;
    :) echo "Option -$OPTARG requires an argument." >&2; usage ;;
  esac
done

if [ -z "$message" ]; then
  echo "Error: -m <message> is required" >&2
  usage
fi

case "$bump" in
  patch|minor|major|none) ;;
  *) echo "Error: -b must be one of patch|minor|major|none" >&2; exit 1 ;;
esac

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"

step "Building keybindings (src/*.json -> dist/keybindings.json + package.json)"
npm run build

if [ "$bump" != "none" ]; then
  step "Bumping version ($bump)"
  npm version "$bump" --no-git-tag-version
fi

version="$(node -p "require('./package.json').version")"

step "Staging changes"
git add -A

if git diff --cached --quiet; then
  warn "Nothing to commit."
else
  git commit -m "$message (v$version)"
fi

step "Packaging extension (vsce package)"
npx vsce package

if [ "$push" = true ]; then
  step "Pushing to remote"
  git push
else
  warn "Skipping git push. Re-run with -p to push the commit."
fi

if [ "$publish" = true ]; then
  step "Publishing to the VS Code Marketplace"
  npx vsce publish
else
  warn "Skipping marketplace publish. Re-run with -P once you're ready (requires 'vsce login')."
fi

printf '\033[32mDone. v%s\033[0m\n' "$version"
