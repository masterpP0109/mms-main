#Requires -Version 5.1
<#
.SYNOPSIS
    Extracts images from Desktop subfolders based on DSC picture-number references
    listed in an Excel catalogue (African_Arts_Simple_Seller_Catalogue.xlsx).

.DESCRIPTION
    1. Reads all DSC references from every cell of the Excel workbook.
    2. Expands shorthand ranges such as "DSC 8296-99" into individual numbers.
    3. Searches all subfolders on the Desktop recursively for matching image files.
    4. Copies matching files to Desktop\ExtractedImages\ with safe duplicate naming.
    5. Writes Found_Picture_Numbers.txt, Missing_Picture_Numbers.txt, Extraction_Log.txt.

.NOTES
    Requires the ImportExcel module (auto-detected; install instructions shown if missing).
    Does NOT require Microsoft Excel to be installed or running.
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Continue'   # keep going on non-fatal errors

# ─────────────────────────────────────────────────────────────
# 0. CONFIGURATION
# ─────────────────────────────────────────────────────────────
$Desktop        = [System.Environment]::GetFolderPath('Desktop')
$ExcelFile      = Join-Path $Desktop 'African_Arts_Simple_Seller_Catalogue.xlsx'
$OutputFolder   = Join-Path $Desktop 'ExtractedImages'
$ImageExtensions = @('.jpg','.jpeg','.png','.webp','.gif','.bmp','.tif','.tiff')

# ─────────────────────────────────────────────────────────────
# 1. CHECK ImportExcel MODULE
# ─────────────────────────────────────────────────────────────
if (-not (Get-Module -ListAvailable -Name ImportExcel)) {
    Write-Host ""
    Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
    Write-Host "║  ImportExcel module is NOT installed.                    ║" -ForegroundColor Yellow
    Write-Host "║  Run the command below, then re-run this script:         ║" -ForegroundColor Yellow
    Write-Host "║                                                          ║" -ForegroundColor Yellow
    Write-Host "║  Install-Module ImportExcel -Scope CurrentUser -Force    ║" -ForegroundColor Cyan
    Write-Host "║                                                          ║" -ForegroundColor Yellow
    Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}
Import-Module ImportExcel -ErrorAction Stop

# ─────────────────────────────────────────────────────────────
# 2. VALIDATE INPUTS
# ─────────────────────────────────────────────────────────────
if (-not (Test-Path $ExcelFile)) {
    Write-Error "Excel file not found: $ExcelFile`nPlace 'African_Arts_Simple_Seller_Catalogue.xlsx' on your Desktop and try again."
    exit 1
}

if (-not (Test-Path $OutputFolder)) {
    New-Item -ItemType Directory -Path $OutputFolder | Out-Null
    Write-Host "Created output folder: $OutputFolder" -ForegroundColor Green
}

# ─────────────────────────────────────────────────────────────
# 3. DSC RANGE PARSER
#    Input : a raw cell string, e.g. "DSC 8296-99, DSC 8451"
#    Output: a [System.Collections.Generic.HashSet[int]] of picture numbers
# ─────────────────────────────────────────────────────────────
function Expand-DscReferences {
    param([string]$RawText)

    $numbers = [System.Collections.Generic.HashSet[int]]::new()
    if ([string]::IsNullOrWhiteSpace($RawText)) { return $numbers }

    # Tokenise: split on whitespace / commas / semicolons but keep "DSC" + digits together.
    # Strategy: find every occurrence of  DSC[\s_-]*(\d+)(?:\s*-\s*(\d+))?
    $pattern = 'DSC[\s_\-]*(\d+)(?:\s*[\-–]\s*(\d+))?'
    $matches  = [regex]::Matches($RawText, $pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

    foreach ($m in $matches) {
        $startFull = [int]$m.Groups[1].Value   # e.g. 8296  or  8251

        if ($m.Groups[2].Success) {
            $endRaw = $m.Groups[2].Value       # e.g. "99" or "07" or "8354"

            # ── Range-expansion logic ──────────────────────────────────────
            # If the end token is SHORTER than the start token we need to
            # reconstruct the full end number by replacing the last N digits
            # of the start number with the end token.
            #
            # Examples:
            #   start=8296  end="99"   → len(end)=2, len(start)=4
            #                            prefix = "82", suffix = "99"  → 8299
            #   start=8306  end="07"   → prefix = "83", suffix = "07"  → 8307
            #   start=8251  end="8354" → len(end)=4 = len(start)       → 8354  (full number)
            # ──────────────────────────────────────────────────────────────
            $startStr = $m.Groups[1].Value
            if ($endRaw.Length -lt $startStr.Length) {
                $prefix  = $startStr.Substring(0, $startStr.Length - $endRaw.Length)
                $endFull = [int]($prefix + $endRaw)
            } else {
                $endFull = [int]$endRaw
            }

            # Sanity check: end must be >= start
            if ($endFull -lt $startFull) {
                Write-Warning "Skipping invalid range in cell: '$RawText' (parsed $startFull-$endFull)"
                continue
            }

            for ($n = $startFull; $n -le $endFull; $n++) {
                [void]$numbers.Add($n)
            }
        } else {
            # Single number
            [void]$numbers.Add($startFull)
        }
    }
    return $numbers
}

# ─────────────────────────────────────────────────────────────
# 4. READ EXCEL — collect all DSC picture numbers
# ─────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "Reading Excel catalogue: $ExcelFile" -ForegroundColor Cyan

$allDscNumbers = [System.Collections.Generic.HashSet[int]]::new()
$logLines      = [System.Collections.Generic.List[string]]::new()

try {
    $workbook = Open-ExcelPackage -Path $ExcelFile
    foreach ($ws in $workbook.Workbook.Worksheets) {
        Write-Host "  Processing sheet: $($ws.Name)"
        $dim = $ws.Dimension
        if ($null -eq $dim) { continue }
        for ($row = $dim.Start.Row; $row -le $dim.End.Row; $row++) {
            for ($col = $dim.Start.Column; $col -le $dim.End.Column; $col++) {
                $cell     = $ws.Cells[$row, $col]
                $cellText = if ($null -ne $cell.Value) { $cell.Value.ToString() } else { '' }
                if ($cellText -match 'DSC') {
                    $found = Expand-DscReferences -RawText $cellText
                    foreach ($n in $found) { [void]$allDscNumbers.Add($n) }
                }
            }
        }
    }
    Close-ExcelPackage $workbook -NoSave
} catch {
    Write-Error "Failed to read Excel file: $_"
    exit 1
}

$totalRequested = $allDscNumbers.Count
Write-Host "  → Found $totalRequested unique DSC picture numbers in the catalogue." -ForegroundColor Green
$logLines.Add("Catalogue DSC numbers found: $totalRequested")
$logLines.Add("Numbers: $( ($allDscNumbers | Sort-Object) -join ', ' )")
$logLines.Add("")

if ($totalRequested -eq 0) {
    Write-Warning "No DSC picture numbers found in the Excel file. Check that the file contains 'DSC' references."
    exit 0
}

# ─────────────────────────────────────────────────────────────
# 5. SCAN IMAGE FILES ON DESKTOP (exclude ExtractedImages folder)
# ─────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "Scanning Desktop for image files (this may take a moment)..." -ForegroundColor Cyan

$extensionSet = [System.Collections.Generic.HashSet[string]]::new(
    [System.StringComparer]::OrdinalIgnoreCase
)
foreach ($ext in $ImageExtensions) { [void]$extensionSet.Add($ext) }

# Regex to extract DSC number from filename: DSC[_\- ]?(\d+)
$fileNumPattern = [regex]'(?i)DSC[\s_\-]*(\d+)'

# Build a lookup: DSC-number → list of file paths
$numberToFiles = [System.Collections.Generic.Dictionary[int, System.Collections.Generic.List[string]]]::new()

Get-ChildItem -Path $Desktop -Directory -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -ne $OutputFolder } |
    ForEach-Object {
        try {
            Get-ChildItem -Path $_.FullName -Recurse -File -ErrorAction SilentlyContinue |
                Where-Object { $extensionSet.Contains($_.Extension) } |
                ForEach-Object {
                    $fm = $fileNumPattern.Match($_.BaseName)
                    if ($fm.Success) {
                        $num = [int]$fm.Groups[1].Value
                        if (-not $numberToFiles.ContainsKey($num)) {
                            $numberToFiles[$num] = [System.Collections.Generic.List[string]]::new()
                        }
                        $numberToFiles[$num].Add($_.FullName)
                    }
                }
        } catch {
            $logLines.Add("WARNING: Could not scan folder '$($_.FullName)': $_")
            Write-Warning "Could not scan folder '$($_.FullName)': $_"
        }
    }

$totalIndexed = ($numberToFiles.Values | ForEach-Object { $_.Count } | Measure-Object -Sum).Sum
Write-Host "  → Indexed $totalIndexed image files across Desktop subfolders." -ForegroundColor Green

# ─────────────────────────────────────────────────────────────
# 6. MATCH AND COPY
# ─────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "Copying matching images to: $OutputFolder" -ForegroundColor Cyan

$copiedFiles   = [System.Collections.Generic.List[string]]::new()
$missingNums   = [System.Collections.Generic.List[int]]::new()
$copyErrors    = [System.Collections.Generic.List[string]]::new()
$copyCount     = 0

foreach ($num in ($allDscNumbers | Sort-Object)) {
    if (-not $numberToFiles.ContainsKey($num)) {
        $missingNums.Add($num)
        continue
    }

    foreach ($srcPath in $numberToFiles[$num]) {
        $srcFile = [System.IO.FileInfo]$srcPath
        $destName = $srcFile.Name
        $destPath = Join-Path $OutputFolder $destName

        # ── Duplicate-safe naming ──────────────────────────────────────
        if (Test-Path $destPath) {
            $base    = $srcFile.BaseName
            $ext     = $srcFile.Extension
            $counter = 1
            do {
                $destName = "${base}_${counter}${ext}"
                $destPath = Join-Path $OutputFolder $destName
                $counter++
            } while (Test-Path $destPath)
        }
        # ──────────────────────────────────────────────────────────────

        try {
            Copy-Item -LiteralPath $srcPath -Destination $destPath -ErrorAction Stop
            $copyCount++
            $copiedFiles.Add("DSC_$num  →  $destName  (from: $srcPath)")
            Write-Host "  ✓ DSC_$num  →  $destName" -ForegroundColor Green
        } catch {
            $msg = "ERROR copying '$srcPath' → '$destPath': $_"
            $copyErrors.Add($msg)
            Write-Warning $msg
        }
    }
}

# ─────────────────────────────────────────────────────────────
# 7. WRITE REPORT FILES
# ─────────────────────────────────────────────────────────────
$timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'

# Found_Picture_Numbers.txt
$foundPath = Join-Path $OutputFolder 'Found_Picture_Numbers.txt'
$foundContent = @(
    "African Arts Image Extraction — Found Picture Numbers"
    "Generated: $timestamp"
    "="*60
    ""
) + ($copiedFiles | ForEach-Object { $_ })
Set-Content -Path $foundPath -Value $foundContent -Encoding UTF8

# Missing_Picture_Numbers.txt
$missingPath = Join-Path $OutputFolder 'Missing_Picture_Numbers.txt'
$missingContent = @(
    "African Arts Image Extraction — Missing Picture Numbers"
    "Generated: $timestamp"
    "="*60
    "Total missing: $($missingNums.Count)"
    ""
) + ($missingNums | Sort-Object | ForEach-Object { "DSC_$_" })
Set-Content -Path $missingPath -Value $missingContent -Encoding UTF8

# Extraction_Log.txt
$logPath = Join-Path $OutputFolder 'Extraction_Log.txt'
$summaryContent = @(
    "African Arts Image Extraction — Summary Log"
    "Generated: $timestamp"
    "="*60
    ""
    "Excel file          : $ExcelFile"
    "Output folder       : $OutputFolder"
    ""
    "Unique DSC numbers in catalogue : $totalRequested"
    "Image files indexed on Desktop  : $totalIndexed"
    "Images successfully copied      : $copyCount"
    "DSC numbers NOT found           : $($missingNums.Count)"
    "Copy errors                     : $($copyErrors.Count)"
    ""
    "─"*60
    "COPY ERRORS"
    "─"*60
) + ($copyErrors | ForEach-Object { $_ }) + @(
    ""
    "─"*60
    "SCANNER LOG"
    "─"*60
) + ($logLines | ForEach-Object { $_ })

Set-Content -Path $logPath -Value $summaryContent -Encoding UTF8

# ─────────────────────────────────────────────────────────────
# 8. FINAL CONSOLE SUMMARY
# ─────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                EXTRACTION COMPLETE                      ║" -ForegroundColor Cyan
Write-Host "╠══════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
Write-Host ("║  Unique DSC numbers in catalogue : {0,-24}║" -f $totalRequested) -ForegroundColor White
Write-Host ("║  Image files indexed on Desktop  : {0,-24}║" -f $totalIndexed)   -ForegroundColor White
Write-Host ("║  Images successfully copied      : {0,-24}║" -f $copyCount)      -ForegroundColor Green
Write-Host ("║  DSC numbers NOT found           : {0,-24}║" -f $missingNums.Count) -ForegroundColor $(if ($missingNums.Count -gt 0) { 'Yellow' } else { 'Green' })
Write-Host ("║  Copy errors                     : {0,-24}║" -f $copyErrors.Count) -ForegroundColor $(if ($copyErrors.Count -gt 0) { 'Red' } else { 'Green' })
Write-Host "╠══════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
Write-Host "║  Reports saved to:                                       ║" -ForegroundColor Cyan
Write-Host "║    Found_Picture_Numbers.txt                             ║" -ForegroundColor White
Write-Host "║    Missing_Picture_Numbers.txt                           ║" -ForegroundColor White
Write-Host "║    Extraction_Log.txt                                    ║" -ForegroundColor White
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
