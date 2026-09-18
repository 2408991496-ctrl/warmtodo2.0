$ErrorActionPreference = "SilentlyContinue"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$ServerScript = Join-Path $PSScriptRoot "WarmTodo-Server.ps1"
$Port = 5177
$Url = "http://127.0.0.1:$Port/index.html"

function Test-WarmTodoServer {
  try {
    $client = [System.Net.Sockets.TcpClient]::new()
    $async = $client.BeginConnect("127.0.0.1", $Port, $null, $null)
    $connected = $async.AsyncWaitHandle.WaitOne(250)
    if ($connected) { $client.EndConnect($async) }
    $client.Close()
    return $connected
  } catch {
    return $false
  }
}

if (-not (Test-WarmTodoServer)) {
  Start-Process -FilePath "powershell.exe" -ArgumentList @(
    "-NoProfile",
    "-ExecutionPolicy", "Bypass",
    "-WindowStyle", "Hidden",
    "-File", "`"$ServerScript`""
  ) -WindowStyle Hidden

  for ($i = 0; $i -lt 20; $i++) {
    Start-Sleep -Milliseconds 150
    if (Test-WarmTodoServer) { break }
  }
}

Start-Process $Url
