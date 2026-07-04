$css = [System.IO.File]::ReadAllText("style.css")

# FAB dan og'ir animatsiyalarni olib tashlaymiz
$css = $css -replace 'animation: fabPulse 2s infinite', '/* animation: fabPulse removed for perf */'
$css = $css -replace 'animation: fabRing 2s infinite', '/* animation: fabRing removed */'
$css = $css -replace 'animation: pulse \d', '/* animation pulse removed */'
$css = $css -replace 'animation: float \d', '/* animation float removed */'

[System.IO.File]::WriteAllText("style.css", $css)
Write-Host "Removed continuous CSS animations"
