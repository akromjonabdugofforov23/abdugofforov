$cssPath = "C:\Users\akrom\.gemini\antigravity\scratch\abdugofforov\style.css"
$cssDir = "C:\Users\akrom\.gemini\antigravity\scratch\abdugofforov\css"

if (!(Test-Path $cssDir)) {
    New-Item -ItemType Directory -Force -Path $cssDir | Out-Null
}

$lines = Get-Content $cssPath

Set-Content -Path (Join-Path $cssDir "variables.css") -Value $lines[0..131]
Set-Content -Path (Join-Path $cssDir "base.css") -Value $lines[132..306]
Set-Content -Path (Join-Path $cssDir "layout.css") -Value $lines[307..1397]
Set-Content -Path (Join-Path $cssDir "components.css") -Value $lines[1398..1841]
Set-Content -Path (Join-Path $cssDir "pages.css") -Value $lines[1842..2894]
Set-Content -Path (Join-Path $cssDir "animations.css") -Value $lines[2895..($lines.Length - 1)]

$imports = @"
@import url('css/variables.css');
@import url('css/base.css');
@import url('css/layout.css');
@import url('css/components.css');
@import url('css/pages.css');
@import url('css/animations.css');
"@

Set-Content -Path $cssPath -Value $imports

Write-Host "CSS split successful!"
