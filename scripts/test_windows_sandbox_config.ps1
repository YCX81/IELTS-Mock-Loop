$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$configPath = Join-Path $projectRoot '.codex\config.toml'
$config = Get-Content -LiteralPath $configPath -Raw

if ($config -notmatch '(?ms)^\[windows\]\s*.*?^sandbox\s*=\s*["'']elevated["'']\s*$') {
    throw 'Image workflows with split writable roots require the elevated Windows sandbox.'
}

Write-Output 'Windows image sandbox config is valid.'
