$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$Port = 5177
$Root = [System.IO.Path]::GetFullPath($ProjectRoot)
$Listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Parse("127.0.0.1"), $Port)

$MimeTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css" = "text/css; charset=utf-8"
  ".js" = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".svg" = "image/svg+xml"
  ".ico" = "image/x-icon"
  ".png" = "image/png"
}

function Resolve-RequestPath {
  param([string]$RawPath)

  $pathOnly = ($RawPath -split "\?")[0]
  $decoded = [System.Uri]::UnescapeDataString($pathOnly)
  if ([string]::IsNullOrWhiteSpace($decoded) -or $decoded -eq "/") {
    $decoded = "/index.html"
  }

  $relative = $decoded.TrimStart("/") -replace "/", [System.IO.Path]::DirectorySeparatorChar
  $fullPath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($Root, $relative))
  if (-not $fullPath.StartsWith($Root, [System.StringComparison]::OrdinalIgnoreCase)) {
    return $null
  }
  return $fullPath
}

function Send-Response {
  param(
    [System.Net.Sockets.NetworkStream]$Stream,
    [int]$StatusCode,
    [string]$StatusText,
    [byte[]]$Body,
    [string]$ContentType
  )

  $headers = "HTTP/1.1 $StatusCode $StatusText`r`nContent-Length: $($Body.Length)`r`nContent-Type: $ContentType`r`nConnection: close`r`nCache-Control: no-cache`r`n`r`n"
  $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headers)
  $Stream.Write($headerBytes, 0, $headerBytes.Length)
  if ($Body.Length -gt 0) {
    $Stream.Write($Body, 0, $Body.Length)
  }
}

$Listener.Start()

while ($true) {
  $client = $Listener.AcceptTcpClient()
  try {
    $stream = $client.GetStream()
    $client.ReceiveTimeout = 1500
    $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)
    $firstLine = $reader.ReadLine()
    while ($true) {
      $line = $reader.ReadLine()
      if ($null -eq $line -or $line -eq "") { break }
    }
    if ([string]::IsNullOrWhiteSpace($firstLine)) { continue }

    $parts = $firstLine -split " "
    $method = $parts[0]
    $requestPath = $parts[1]

    if ($method -ne "GET" -and $method -ne "HEAD") {
      $body = [System.Text.Encoding]::UTF8.GetBytes("Method not allowed")
      Send-Response $stream 405 "Method Not Allowed" $body "text/plain; charset=utf-8"
      continue
    }

    $file = Resolve-RequestPath $requestPath
    if (-not $file -or -not (Test-Path -LiteralPath $file -PathType Leaf)) {
      $body = [System.Text.Encoding]::UTF8.GetBytes("Not found")
      Send-Response $stream 404 "Not Found" $body "text/plain; charset=utf-8"
      continue
    }

    $extension = [System.IO.Path]::GetExtension($file).ToLowerInvariant()
    $contentType = if ($MimeTypes.ContainsKey($extension)) { $MimeTypes[$extension] } else { "application/octet-stream" }
    $body = if ($method -eq "HEAD") { [byte[]]::new(0) } else { [System.IO.File]::ReadAllBytes($file) }
    Send-Response $stream 200 "OK" $body $contentType
  } catch {
    try {
      $body = [System.Text.Encoding]::UTF8.GetBytes("WarmTodo local server error")
      Send-Response $stream 500 "Internal Server Error" $body "text/plain; charset=utf-8"
    } catch {}
  } finally {
    $client.Close()
  }
}
