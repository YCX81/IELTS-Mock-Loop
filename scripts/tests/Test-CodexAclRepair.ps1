$ErrorActionPreference = 'Stop'

Import-Module (Join-Path $PSScriptRoot '..\CodexAclRepair.Core.psm1') -Force

function Assert-Equal($Expected, $Actual, $Message) {
    if ($Expected -ne $Actual) {
        throw "$Message`nExpected: $Expected`nActual:   $Actual"
    }
}

Assert-Equal 'C:\Users\ycx\Desktop\IELTS-Mock-Loop' (
    ConvertFrom-WslMirrorPath 'C:\mnt\c\Users\ycx\Desktop\IELTS-Mock-Loop'
) 'The accidental Windows rendering of a WSL mount must be normalized.'

Assert-Equal 'D:\work\repo' (ConvertFrom-WslMirrorPath '/mnt/d/work/repo') (
    'A genuine WSL mount path must be normalized.'
)

Assert-Equal 'C:\normal\repo' (ConvertFrom-WslMirrorPath 'C:\normal\repo') (
    'A normal Windows path must remain unchanged.'
)

$state = [pscustomobject]@{
    'thread-writable-roots' = [pscustomobject]@{
        thread1 = @(
            'C:\Users\ycx\Desktop\IELTS-Mock-Loop',
            'C:\mnt\c\Users\ycx\Desktop\IELTS-Mock-Loop'
        )
    }
    untouched = 'C:\mnt\c\this-is-conversation-data'
}

$result = Repair-CodexWritableRootState -State $state -PathExists { param($Path) $true }
Assert-Equal 1 $result.ChangedCount 'Exactly one mirrored writable root should be removed.'
Assert-Equal 1 @($state.'thread-writable-roots'.thread1).Count 'Writable roots must be deduplicated.'
Assert-Equal 'C:\Users\ycx\Desktop\IELTS-Mock-Loop' $state.'thread-writable-roots'.thread1[0] (
    'The canonical Windows root must be retained.'
)
Assert-Equal 'C:\mnt\c\this-is-conversation-data' $state.untouched (
    'Unrelated state fields must never be rewritten.'
)

$fixture = Join-Path $env:TEMP ('codex-acl-test-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $fixture | Out-Null
try {
    $sid = 'S-1-5-21-1096026254-4160556964-1523031569-1483158818'
    $acl = Get-Acl -LiteralPath $fixture
    $rule = [System.Security.AccessControl.FileSystemAccessRule]::new(
        [System.Security.Principal.SecurityIdentifier]::new($sid),
        [System.Security.AccessControl.FileSystemRights]::ReadData,
        [System.Security.AccessControl.AccessControlType]::Deny
    )
    $acl.AddAccessRule($rule)
    Set-Acl -LiteralPath $fixture -AclObject $acl

    $before = @((Get-Acl -LiteralPath $fixture).Access |
        Where-Object { $_.IdentityReference.Value -eq $sid }).Count
    Assert-Equal 1 $before 'The test SID rule must exist before repair.'

    $removed = Remove-CodexCapabilityAce -LiteralPath $fixture -Sid $sid
    Assert-Equal 1 $removed 'Exactly the targeted capability ACE must be removed.'

    $after = @((Get-Acl -LiteralPath $fixture).Access |
        Where-Object { $_.IdentityReference.Value -eq $sid }).Count
    Assert-Equal 0 $after 'The targeted capability ACE must be absent after repair.'
}
finally {
    Remove-Item -LiteralPath $fixture -Recurse -Force
}

Write-Output 'Codex ACL repair tests passed.'
