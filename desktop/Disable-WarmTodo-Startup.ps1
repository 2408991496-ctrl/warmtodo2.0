$ErrorActionPreference = "Stop"

$Startup = [Environment]::GetFolderPath("Startup")
$ShortcutPath = Join-Path $Startup "WarmTodo.lnk"

if (Test-Path -LiteralPath $ShortcutPath) {
  Remove-Item -LiteralPath $ShortcutPath
  Write-Host "WarmTodo startup shortcut disabled."
} else {
  Write-Host "WarmTodo startup shortcut was not enabled."
}
