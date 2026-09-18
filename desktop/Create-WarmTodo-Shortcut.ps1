$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$Launcher = Join-Path $PSScriptRoot "WarmTodo-Launch.vbs"
$Icon = Join-Path $ProjectRoot "assets\warmtodo.ico"
$Desktop = [Environment]::GetFolderPath("Desktop")
$ShortcutPath = Join-Path $Desktop "WarmTodo.lnk"

$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($ShortcutPath)
$shortcut.TargetPath = "wscript.exe"
$shortcut.Arguments = "`"$Launcher`""
$shortcut.WorkingDirectory = $ProjectRoot
$shortcut.WindowStyle = 7
$shortcut.Description = "WarmTodo - Things I Have Done"
if (Test-Path -LiteralPath $Icon) {
  $shortcut.IconLocation = $Icon
}
$shortcut.Save()

Write-Host "Created desktop shortcut: $ShortcutPath"
