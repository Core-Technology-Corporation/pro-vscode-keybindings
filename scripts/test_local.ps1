<#
.SYNOPSIS
  Installs deps, builds the extension and launches a VS Code Extension
  Development Host window with it loaded, ready to test.

  .EXAMPLE
  ./scripts/test_local.ps1
#>

$ErrorActionPreference = 'Stop'

function Step($text) {
    Write-Host "==> $text" -ForegroundColor Cyan
}

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Step "Installing dependencies"
npm install
if ($LASTEXITCODE -ne 0) { throw "npm install failed" }

Step "Building (keybindings + extension bundle)"
npm run build
if ($LASTEXITCODE -ne 0) { throw "Build failed" }

Step "Launching Extension Development Host"
code --extensionDevelopmentPath="$root" --new-window
