<#
.SYNOPSIS
  Uninstalls (or disables) the Pro VSCode Keybindings extension from your
  local VS Code, in case it was installed via the .vsix (Extensions:
  Install from VSIX / code --install-extension).

  Note: this does NOT affect the Extension Development Host (F5 / test_local.ps1)
  flow — that one is a temporary isolated window and never actually installs
  anything into your real VS Code.

.EXAMPLE
  ./scripts/uninstall_local.ps1
  Uninstalls the extension completely.

.EXAMPLE
  ./scripts/uninstall_local.ps1 -Disable
  Just disables it for your next VS Code session (keeps it installed).
#>

param(
    [switch]$Disable
)

$ErrorActionPreference = 'Stop'

$extensionId = 'alvarosiles.pro-vscode-keybindings'

function Step($text) {
    Write-Host "==> $text" -ForegroundColor Cyan
}

$installed = code --list-extensions | Where-Object { $_ -eq $extensionId }
if (-not $installed) {
    Write-Host "'$extensionId' no está instalada en este VS Code." -ForegroundColor Yellow
    exit 0
}

if ($Disable) {
    Step "Deshabilitando $extensionId para la próxima sesión"
    code --disable-extension $extensionId
    Write-Host "Quedó deshabilitada. Para reactivarla: abrí VS Code > Extensions > buscala > Enable." -ForegroundColor Green
}
else {
    Step "Desinstalando $extensionId"
    code --uninstall-extension $extensionId
    if ($LASTEXITCODE -ne 0) { throw "No se pudo desinstalar la extensión" }
    Write-Host "Desinstalada. Reiniciá VS Code para que los atajos vuelvan a su estado original." -ForegroundColor Green
}
