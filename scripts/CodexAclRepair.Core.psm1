Set-StrictMode -Version Latest

function ConvertFrom-WslMirrorPath {
    param([Parameter(Mandatory)][string]$Path)

    if ($Path -match '^(?i)C:\\mnt\\([a-z])\\(.*)$') {
        return ('{0}:\{1}' -f $Matches[1].ToUpperInvariant(), $Matches[2])
    }
    if ($Path -match '^/mnt/([a-zA-Z])/(.*)$') {
        return ('{0}:\{1}' -f $Matches[1].ToUpperInvariant(), ($Matches[2] -replace '/', '\'))
    }
    return $Path
}

function Repair-CodexWritableRootState {
    param(
        [Parameter(Mandatory)]$State,
        [scriptblock]$PathExists = { param($Path) Test-Path -LiteralPath $Path }
    )

    $changed = 0
    $table = $State.'thread-writable-roots'
    if ($null -eq $table) {
        return [pscustomobject]@{ ChangedCount = 0 }
    }

    foreach ($thread in $table.PSObject.Properties) {
        $normalized = [System.Collections.Generic.List[string]]::new()
        $seen = [System.Collections.Generic.HashSet[string]]::new(
            [System.StringComparer]::OrdinalIgnoreCase
        )
        foreach ($root in @($thread.Value)) {
            $entryChanged = $false
            $candidate = ConvertFrom-WslMirrorPath ([string]$root)
            if ($candidate -ne $root -and -not (& $PathExists $candidate)) {
                $candidate = [string]$root
            }
            if ($candidate -ne $root) { $entryChanged = $true }
            if ($seen.Add($candidate)) {
                $normalized.Add($candidate)
            }
            else {
                $entryChanged = $true
            }
            if ($entryChanged) { $changed++ }
        }
        $thread.Value = @($normalized)
    }

    return [pscustomobject]@{ ChangedCount = $changed }
}

function Remove-CodexCapabilityAce {
    param(
        [Parameter(Mandatory)][string]$LiteralPath,
        [Parameter(Mandatory)][string]$Sid
    )

    if (-not (Test-Path -LiteralPath $LiteralPath)) { return 0 }
    $acl = Get-Acl -LiteralPath $LiteralPath
    $rules = @($acl.Access | Where-Object {
        -not $_.IsInherited -and $_.IdentityReference.Value -eq $Sid
    })
    foreach ($rule in $rules) {
        [void]$acl.RemoveAccessRuleSpecific($rule)
    }
    if ($rules.Count -gt 0) {
        Set-Acl -LiteralPath $LiteralPath -AclObject $acl
    }
    return $rules.Count
}

function Set-CodexAclFromSddl {
    param(
        [Parameter(Mandatory)][string]$LiteralPath,
        [Parameter(Mandatory)][string]$Sddl
    )

    if (-not (Test-Path -LiteralPath $LiteralPath)) { return $false }
    $acl = Get-Acl -LiteralPath $LiteralPath
    $acl.SetSecurityDescriptorSddlForm($Sddl)
    Set-Acl -LiteralPath $LiteralPath -AclObject $acl
    return $true
}

Export-ModuleMember -Function ConvertFrom-WslMirrorPath, Repair-CodexWritableRootState,
    Remove-CodexCapabilityAce, Set-CodexAclFromSddl
