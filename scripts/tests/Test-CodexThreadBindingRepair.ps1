$ErrorActionPreference = 'Stop'

Import-Module (Join-Path $PSScriptRoot '..\CodexThreadBinding.Core.psm1') -Force

function Assert-Equal($Expected, $Actual, $Message) {
    if ($Expected -ne $Actual) {
        throw "$Message`nExpected: $Expected`nActual:   $Actual"
    }
}

$threadId = '019f3f34-1028-7492-aee8-c6b083e44b98'
$oldRoot = 'C:\mnt\c\Users\ycx\Desktop\IELTS-Mock-Loop'
$newRoot = 'C:\Users\ycx\Desktop\IELTS-Mock-Loop'
$meta = [pscustomobject]@{
    timestamp = '2026-07-08T00:00:00Z'
    type = 'session_meta'
    payload = [pscustomobject]@{
        id = $threadId
        cwd = $oldRoot
        source = 'app'
    }
}
$bodyLine = '{"type":"response_item","payload":{"text":"Keep C:\\mnt\\c\\Users unchanged"}}'
$fixtureText = ($meta | ConvertTo-Json -Depth 10 -Compress) + "`n" + $bodyLine + "`n"
$fixtureBytes = [Text.Encoding]::UTF8.GetBytes($fixtureText)

$result = Update-CodexSessionMetadataBytes -Bytes $fixtureBytes -ThreadId $threadId `
    -NewRoot $newRoot
$updatedText = [Text.Encoding]::UTF8.GetString($result.Bytes)
$lines = $updatedText -split "`n"
$updatedMeta = $lines[0] | ConvertFrom-Json

Assert-Equal $newRoot $updatedMeta.payload.cwd 'Only session metadata cwd must be migrated.'
Assert-Equal $bodyLine $lines[1] 'Conversation body bytes must remain unchanged.'
Assert-Equal $oldRoot $result.OldRoot 'The original cwd must be reported.'

$wrongIdFailed = $false
try {
    Update-CodexSessionMetadataBytes -Bytes $fixtureBytes -ThreadId 'wrong-id' `
        -NewRoot $newRoot | Out-Null
}
catch { $wrongIdFailed = $true }
Assert-Equal $true $wrongIdFailed 'A mismatched thread id must fail closed.'

$state = [pscustomobject]@{
    'thread-project-assignments' = [pscustomobject]@{}
    'thread-writable-roots' = [pscustomobject]@{}
    'projectless-thread-ids' = @($threadId, 'keep-me')
}
Set-CodexThreadBinding -State $state -ThreadId $threadId -ProjectId 'local-test' `
    -NewRoot $newRoot

Assert-Equal 'local-test' $state.'thread-project-assignments'.$threadId.projectId `
    'The task must be attached to the requested local project.'
Assert-Equal $newRoot $state.'thread-project-assignments'.$threadId.cwd `
    'The project assignment cwd must use the real Windows root.'
Assert-Equal $newRoot $state.'thread-writable-roots'.$threadId[0] `
    'The writable root must use the real Windows root.'
Assert-Equal 'keep-me' ($state.'projectless-thread-ids' -join ',') `
    'Only the migrated task must be removed from projectless tasks.'

Write-Output 'Codex thread binding repair tests passed.'
