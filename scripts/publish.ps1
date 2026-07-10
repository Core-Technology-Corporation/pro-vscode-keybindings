<#
.SYNOPSIS
  Builds, commits, packages and (optionally) publishes the extension.

.EXAMPLE
  ./scripts/publish.ps1 -Message "Add debug shortcuts"
  Builds, bumps patch version, commits, and creates a .vsix. Does not push or publish.

.EXAMPLE
  ./scripts/publish.ps1 -Message "Add debug shortcuts" -Bump minor -Push -Publish
  Same, but also pushes to the remote and publishes to the Marketplace.
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$Message,

    [ValidateSet('patch', 'minor', 'major', 'none')]
    [string]$Bump = 'patch',

    [switch]$Push,
    [switch]$Publish
)

$ErrorActionPreference = 'Stop'

function Step($text) {
    Write-Host "==> $text" -ForegroundColor Cyan
}

Step "Building keybindings (src/*.json -> dist/keybindings.json + package.json)"
npm run build
if ($LASTEXITCODE -ne 0) { throw "Build failed" }

if ($Bump -ne 'none') {
    Step "Bumping version ($Bump)"
    npm version $Bump --no-git-tag-version
    if ($LASTEXITCODE -ne 0) { throw "Version bump failed" }
}

$version = (Get-Content package.json -Raw | ConvertFrom-Json).version

Step "Staging changes"
git add -A

$staged = git diff --cached --name-only
if (-not $staged) {
    Write-Host "Nothing to commit." -ForegroundColor Yellow
}
else {
    git commit -m "$Message (v$version)"
    if ($LASTEXITCODE -ne 0) { throw "Commit failed" }
}

Step "Packaging extension (vsce package)"
npx vsce package
if ($LASTEXITCODE -ne 0) { throw "Packaging failed" }

if ($Push) {
    Step "Pushing to remote"
    git push
    if ($LASTEXITCODE -ne 0) { throw "Push failed" }
}
else {
    Write-Host "Skipping git push. Re-run with -Push to push the commit." -ForegroundColor Yellow
}

if ($Publish) {
    Step "Publishing to the VS Code Marketplace"
    npx vsce publish
    if ($LASTEXITCODE -ne 0) { throw "Publish failed" }
}
else {
    Write-Host "Skipping marketplace publish. Re-run with -Publish once you're ready (requires 'vsce login')." -ForegroundColor Yellow
}

Write-Host "Done. v$version" -ForegroundColor Green
