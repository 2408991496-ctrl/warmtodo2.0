$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$Launcher = Join-Path $PSScriptRoot "WarmTodo-Launch.vbs"
$Icon = Join-Path $ProjectRoot "assets\warmtodo.ico"
$Startup = [Environment]::GetFolderPath("Startup")
$ShortcutPath = Join-Path $Startup "WarmTodo.lnk"

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

Write-Host "WarmTodo startup shortcut enabled: $ShortcutPath"
