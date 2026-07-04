$js = [System.IO.File]::ReadAllText("app.js")

# O'chirib qo'yamiz (comment out)
$js = $js -replace 'initParticles\(\);', '// initParticles(); // Performance optimization'
$js = $js -replace 'initFooterParticles\(\);', '// initFooterParticles(); // Performance optimization'
$js = $js -replace 'init3DTilt\(\);', '// init3DTilt(); // Performance optimization'

[System.IO.File]::WriteAllText("app.js", $js)
Write-Host "Disabled heavy animations in app.js"

$css = [System.IO.File]::ReadAllText("style.css")
# Glass blur ni kamaytiramiz (GPU ga nagruzkani kamaytirish uchun)
$css = $css -replace '--glass-blur: 15px;', '--glass-blur: 4px;'
$css = $css -replace '--glass-blur: 20px;', '--glass-blur: 6px;'
$css = $css -replace 'backdrop-filter: blur\(10px\);', 'backdrop-filter: blur(4px);'
$css = $css -replace 'backdrop-filter: blur\(8px\);', 'backdrop-filter: blur(4px);'
$css = $css -replace 'backdrop-filter: blur\(6px\);', 'backdrop-filter: blur(2px);'

[System.IO.File]::WriteAllText("style.css", $css)
Write-Host "Optimized backdrop filters in style.css"
