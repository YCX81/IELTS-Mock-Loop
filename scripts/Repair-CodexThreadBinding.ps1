[CmdletBinding()]
param(
    [ValidateSet('Audit', 'Repair')][string]$Mode = 'Audit',
    [string]$ThreadId = '019f3f34-1028-7492-aee8-c6b083e44b98',
    [string]$ProjectId = 'local-5743c8152297a2495088dfd51567e5e0',
    [string]$NewRoot = 'C:\Users\ycx\Desktop\IELTS-Mock-Loop',
    [switch]$WaitForCodexExit
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
Import-Module (Join-Path $PSScriptRoot 'CodexThreadBinding.Core.psm1') -Force

function Get-CodexProcesses {
    return @('codex', 'codex-code-mode-host', 'node_repl') | ForEach-Object {
        Get-Process -Name $_ -ErrorAction SilentlyContinue
    }
}

if (-not (Test-Path -LiteralPath $NewRoot -PathType Container)) {
    throw "Target project root does not exist: $NewRoot"
}
$sessionFiles = @(Get-ChildItem -LiteralPath (Join-Path $env:USERPROFILE '.codex\sessions') `
    -Filter "*$ThreadId*.jsonl" -File -Recurse)
if ($sessionFiles.Count -ne 1) {
    throw "Expected exactly one session file for $ThreadId; found $($sessionFiles.Count)."
}
$sessionPath = $sessionFiles[0].FullName
$statePath = Join-Path $env:USERPROFILE '.codex\.codex-global-state.json'

Write-Output "Thread: $ThreadId"
Write-Output "Session: $sessionPath"
Write-Output "Target root: $NewRoot"
if ($Mode -eq 'Audit') { exit 0 }

if ($WaitForCodexExit) {
    Write-Output 'Waiting for Codex to exit...'
    while (@(Get-CodexProcesses).Count -gt 0) {
        Start-Sleep -Seconds 1
    }
}
elseif (@(Get-CodexProcesses).Count -gt 0) {
    throw 'Close Codex completely before repairing the task binding.'
}

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backupDir = Join-Path (Split-Path -Parent $PSScriptRoot) "work\thread-binding-backup-$stamp"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
$sessionBackup = Join-Path $backupDir (Split-Path -Leaf $sessionPath)
$stateBackup = Join-Path $backupDir '.codex-global-state.json'

$sessionBytes = [IO.File]::ReadAllBytes($sessionPath)
$migration = Update-CodexSessionMetadataBytes -Bytes $sessionBytes `
    -ThreadId $ThreadId -NewRoot $NewRoot
$sessionTemp = "$sessionPath.migrate-$stamp.tmp"
[IO.File]::WriteAllBytes($sessionTemp, $migration.Bytes)
$verifyBytes = [IO.File]::ReadAllBytes($sessionTemp)
$verify = Update-CodexSessionMetadataBytes -Bytes $verifyBytes `
    -ThreadId $ThreadId -NewRoot $NewRoot
if ($verify.OldRoot -ne $NewRoot) {
    throw 'Temporary session metadata verification failed.'
}

$state = Get-Content -LiteralPath $statePath -Raw | ConvertFrom-Json
$null = Set-CodexThreadBinding -State $state -ThreadId $ThreadId `
    -ProjectId $ProjectId -NewRoot $NewRoot
$stateTemp = "$statePath.migrate-$stamp.tmp"
$state | ConvertTo-Json -Depth 100 -Compress | Set-Content -LiteralPath $stateTemp -Encoding utf8
$verifiedState = Get-Content -LiteralPath $stateTemp -Raw | ConvertFrom-Json
if ($verifiedState.'thread-project-assignments'.$ThreadId.cwd -ne $NewRoot) {
    throw 'Temporary global state verification failed.'
}

[IO.File]::Replace($sessionTemp, $sessionPath, $sessionBackup, $true)
[IO.File]::Replace($stateTemp, $statePath, $stateBackup, $true)

$resultPath = Join-Path (Split-Path -Parent $PSScriptRoot) 'work\thread-binding-repair.result.json'
[pscustomobject]@{
    success = $true
    completedAt = (Get-Date).ToString('o')
    threadId = $ThreadId
    oldRoot = $migration.OldRoot
    newRoot = $NewRoot
    projectId = $ProjectId
    backupDir = $backupDir
} | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $resultPath -Encoding utf8

Write-Output "Task binding repaired. Backup: $backupDir"
