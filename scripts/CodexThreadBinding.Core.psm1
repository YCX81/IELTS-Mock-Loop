Set-StrictMode -Version Latest

function Update-CodexSessionMetadataBytes {
    param(
        [Parameter(Mandatory)][byte[]]$Bytes,
        [Parameter(Mandatory)][string]$ThreadId,
        [Parameter(Mandatory)][string]$NewRoot
    )

    $lineFeed = [Array]::IndexOf($Bytes, [byte]10)
    if ($lineFeed -lt 1) { throw 'Session JSONL has no complete first record.' }
    $jsonLength = $lineFeed
    if ($Bytes[$lineFeed - 1] -eq 13) { $jsonLength-- }

    $firstJson = [Text.Encoding]::UTF8.GetString($Bytes, 0, $jsonLength)
    $record = $firstJson | ConvertFrom-Json
    if ($record.type -ne 'session_meta') {
        throw "First JSONL record is not session_meta: $($record.type)"
    }
    if ($record.payload.id -ne $ThreadId) {
        throw "Thread id mismatch: $($record.payload.id)"
    }
    $oldRoot = [string]$record.payload.cwd
    $record.payload.cwd = $NewRoot
    $newFirst = [Text.Encoding]::UTF8.GetBytes(
        ($record | ConvertTo-Json -Depth 100 -Compress)
    )

    $newlineStart = $jsonLength
    $newlineLength = $lineFeed - $newlineStart + 1
    $tailStart = $lineFeed + 1
    $tailLength = $Bytes.Length - $tailStart
    $output = [byte[]]::new($newFirst.Length + $newlineLength + $tailLength)
    [Buffer]::BlockCopy($newFirst, 0, $output, 0, $newFirst.Length)
    [Buffer]::BlockCopy($Bytes, $newlineStart, $output, $newFirst.Length, $newlineLength)
    [Buffer]::BlockCopy(
        $Bytes,
        $tailStart,
        $output,
        $newFirst.Length + $newlineLength,
        $tailLength
    )

    return [pscustomobject]@{ Bytes = $output; OldRoot = $oldRoot }
}

function Set-ObjectProperty {
    param($Object, [string]$Name, $Value)
    $property = $Object.PSObject.Properties[$Name]
    if ($null -eq $property) {
        $Object | Add-Member -MemberType NoteProperty -Name $Name -Value $Value
    }
    else {
        $property.Value = $Value
    }
}

function Set-CodexThreadBinding {
    param(
        [Parameter(Mandatory)]$State,
        [Parameter(Mandatory)][string]$ThreadId,
        [Parameter(Mandatory)][string]$ProjectId,
        [Parameter(Mandatory)][string]$NewRoot
    )

    if ($null -eq $State.'thread-project-assignments') {
        Set-ObjectProperty $State 'thread-project-assignments' ([pscustomobject]@{})
    }
    if ($null -eq $State.'thread-writable-roots') {
        Set-ObjectProperty $State 'thread-writable-roots' ([pscustomobject]@{})
    }
    $assignment = [pscustomobject]@{
        projectKind = 'local'
        projectId = $ProjectId
        cwd = $NewRoot
        pendingCoreUpdate = $false
    }
    Set-ObjectProperty $State.'thread-project-assignments' $ThreadId $assignment
    Set-ObjectProperty $State.'thread-writable-roots' $ThreadId @($NewRoot)
    if ($null -ne $State.'projectless-thread-ids') {
        $State.'projectless-thread-ids' = @(
            $State.'projectless-thread-ids' | Where-Object { $_ -ne $ThreadId }
        )
    }
    return $State
}

Export-ModuleMember -Function Update-CodexSessionMetadataBytes, Set-CodexThreadBinding
