[CmdletBinding(SupportsShouldProcess)]
param(
    [ValidateSet('Audit', 'Repair', 'Rollback')]
    [string]$Mode = 'Audit',
    [string]$BackupPath,
    [string]$CodexCliPath,
    [switch]$SkipOfficialSetup
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
Import-Module (Join-Path $PSScriptRoot 'CodexAclRepair.Core.psm1') -Force

$projectRoot = Split-Path -Parent $PSScriptRoot
$codexHome = Join-Path $env:USERPROFILE '.codex'
$capPath = Join-Path $codexHome 'cap_sid'
$statePath = Join-Path $codexHome '.codex-global-state.json'
$globalConfigPath = Join-Path $codexHome 'config.toml'
$projectConfigPath = Join-Path $projectRoot '.codex\config.toml'

function Assert-CodexStopped {
    $names = @('codex', 'codex-code-mode-host', 'node_repl')
    $running = @($names | Where-Object { Get-Process -Name $_ -ErrorAction SilentlyContinue })
    if ($running.Count -gt 0) {
        throw ('Close the Codex app completely before repair/rollback. Running: ' +
            ($running -join ', '))
    }
}

function Get-CapabilityMappings {
    param($Registry)
    $items = [System.Collections.Generic.List[object]]::new()
    foreach ($sectionName in @('workspace_by_cwd', 'writable_root_by_path')) {
        $section = $Registry.$sectionName
        if ($null -eq $section) { continue }
        foreach ($property in $section.PSObject.Properties) {
            $items.Add([pscustomobject]@{
                Section = $sectionName
                Path = [string]$property.Name
                Sid = [string]$property.Value
            })
        }
    }
    return @($items)
}

function Get-AclTargets {
    param([object[]]$Mappings)
    $targets = [System.Collections.Generic.List[object]]::new()
    $seen = [System.Collections.Generic.HashSet[string]]::new(
        [System.StringComparer]::OrdinalIgnoreCase
    )
    foreach ($mapping in $Mappings) {
        $paths = @($mapping.Path)
        if ($mapping.Section -eq 'workspace_by_cwd') {
            $paths += @('.git', '.codex', '.agents') | ForEach-Object {
                Join-Path $mapping.Path $_
            }
        }
        foreach ($path in $paths) {
            $key = "$($mapping.Sid)|$path"
            if ($seen.Add($key)) {
                $targets.Add([pscustomobject]@{ Path = $path; Sid = $mapping.Sid })
            }
        }
    }
    return @($targets)
}

function Copy-IfPresent {
    param([string]$Path, [string]$Destination)
    if (Test-Path -LiteralPath $Path) {
        Copy-Item -LiteralPath $Path -Destination $Destination -Force
    }
}

function Resolve-CodexCli {
    if ($CodexCliPath) { return $CodexCliPath }
    if ($env:CODEX_CLI_PATH -and (Test-Path -LiteralPath $env:CODEX_CLI_PATH)) {
        return $env:CODEX_CLI_PATH
    }
    $candidate = Get-ChildItem -LiteralPath (Join-Path $env:LOCALAPPDATA 'OpenAI\Codex\bin') `
        -Filter codex.exe -Recurse -ErrorAction SilentlyContinue |
        Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($candidate) { return $candidate.FullName }
    throw 'Could not locate codex.exe. Pass -CodexCliPath explicitly.'
}

if ($Mode -eq 'Rollback') {
    Assert-CodexStopped
    if (-not $BackupPath -or -not (Test-Path -LiteralPath $BackupPath)) {
        throw 'Rollback requires an existing -BackupPath.'
    }
    $aclRecords = Get-Content -LiteralPath (Join-Path $BackupPath 'acl-sddl.json') -Raw |
        ConvertFrom-Json
    foreach ($record in @($aclRecords)) {
        [void](Set-CodexAclFromSddl -LiteralPath $record.Path -Sddl $record.Sddl)
    }
    Copy-IfPresent (Join-Path $BackupPath 'cap_sid') $capPath
    Copy-IfPresent (Join-Path $BackupPath '.codex-global-state.json') $statePath
    Copy-IfPresent (Join-Path $BackupPath 'global-config.toml') $globalConfigPath
    Copy-IfPresent (Join-Path $BackupPath 'project-config.toml') $projectConfigPath
    Write-Output "Rollback completed from $BackupPath"
    exit 0
}

if (-not (Test-Path -LiteralPath $capPath)) {
    throw "Capability registry not found: $capPath"
}
$registry = Get-Content -LiteralPath $capPath -Raw | ConvertFrom-Json
$mappings = Get-CapabilityMappings $registry
$targets = Get-AclTargets $mappings
$existingTargets = @($targets | Where-Object { Test-Path -LiteralPath $_.Path })
$matchingAceCount = 0
foreach ($target in $existingTargets) {
    $matchingAceCount += @((Get-Acl -LiteralPath $target.Path).Access | Where-Object {
        -not $_.IsInherited -and $_.IdentityReference.Value -eq $target.Sid
    }).Count
}

$badWritableRoots = 0
if (Test-Path -LiteralPath $statePath) {
    $stateForAudit = Get-Content -LiteralPath $statePath -Raw | ConvertFrom-Json
    foreach ($thread in $stateForAudit.'thread-writable-roots'.PSObject.Properties) {
        $badWritableRoots += @($thread.Value | Where-Object {
            $_ -match '^(?i)C:\\mnt\\[a-z]\\' -or $_ -match '^/mnt/[a-z]/'
        }).Count
    }
}

Write-Output "Capability mappings: $($mappings.Count)"
Write-Output "Existing ACL targets: $($existingTargets.Count)"
Write-Output "Matching explicit capability ACEs: $matchingAceCount"
Write-Output "WSL-mirrored task writable roots: $badWritableRoots"

if ($Mode -eq 'Audit') { exit 0 }

Assert-CodexStopped
$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = [Security.Principal.WindowsPrincipal]::new($identity)
$isAdmin = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) { throw 'Repair must run from an elevated PowerShell window.' }

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
if (-not $BackupPath) {
    $BackupPath = Join-Path $projectRoot "work\codex-acl-backup-$stamp"
}
New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null
Copy-IfPresent $capPath (Join-Path $BackupPath 'cap_sid')
Copy-IfPresent $statePath (Join-Path $BackupPath '.codex-global-state.json')
Copy-IfPresent $globalConfigPath (Join-Path $BackupPath 'global-config.toml')
Copy-IfPresent $projectConfigPath (Join-Path $BackupPath 'project-config.toml')

$aclRecords = @($existingTargets | ForEach-Object {
    [pscustomobject]@{
        Path = $_.Path
        Sddl = (Get-Acl -LiteralPath $_.Path).Sddl
    }
} | Sort-Object Path -Unique)
$aclRecords | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (
    Join-Path $BackupPath 'acl-sddl.json'
) -Encoding utf8

$removed = 0
foreach ($target in $existingTargets) {
    $removed += Remove-CodexCapabilityAce -LiteralPath $target.Path -Sid $target.Sid
}

if (Test-Path -LiteralPath $statePath) {
    $state = Get-Content -LiteralPath $statePath -Raw | ConvertFrom-Json
    $stateRepair = Repair-CodexWritableRootState -State $state
    if ($stateRepair.ChangedCount -gt 0) {
        $state | ConvertTo-Json -Depth 100 -Compress | Set-Content -LiteralPath $statePath -Encoding utf8
    }
}

$retiredCapPath = "$capPath.pre-repair-$stamp.bak"
Move-Item -LiteralPath $capPath -Destination $retiredCapPath

if (-not $SkipOfficialSetup) {
    $cli = Resolve-CodexCli
    $readinessScript = Join-Path $PSScriptRoot 'check_windows_sandbox_readiness.mjs'
    & node $readinessScript --repair $cli
    if ($LASTEXITCODE -ne 0) {
        throw "Official Windows sandbox setup failed. Backup: $BackupPath"
    }
}

Write-Output "Removed explicit capability ACEs: $removed"
Write-Output "Retired capability registry: $retiredCapPath"
Write-Output "Backup: $BackupPath"
Write-Output 'Repair completed. Restart Codex and create a new task for the final image-tool test.'
