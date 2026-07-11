$appJs = [System.IO.File]::ReadAllText("app.js")

# Extract flashcards using substring
$fcStart = $appJs.IndexOf('const flashcardDecks = {')
$fcEnd = $appJs.IndexOf('// ===== KARTOCHKALAR HOLATI VA KO''RINISHI =====')
if ($fcStart -gt -1 -and $fcEnd -gt $fcStart) {
    $fcText = $appJs.Substring($fcStart, $fcEnd - $fcStart)
    $fcCode = "export " + $fcText
    [System.IO.File]::WriteAllText("data-flashcards.js", $fcCode)
    $appJs = $appJs.Remove($fcStart, $fcEnd - $fcStart)
    $appJs = $appJs.Insert($fcStart, "// ===== FLASHCARDS MOVED TO data-flashcards.js =====`n`n")
    Write-Host "Extracted flashcards"
}

# Extract deutschTests using substring
$testStart = $appJs.IndexOf('const deutschTests = {')
$testEnd = $appJs.IndexOf('// Test holati')
if ($testStart -gt -1 -and $testEnd -gt $testStart) {
    $testText = $appJs.Substring($testStart, $testEnd - $testStart)
    $testCode = "export " + $testText
    [System.IO.File]::WriteAllText("data-tests.js", $testCode)
    $appJs = $appJs.Remove($testStart, $testEnd - $testStart)
    $appJs = $appJs.Insert($testStart, "// ===== DEUTSCH TESTS MOVED TO data-tests.js =====`n`n")
    Write-Host "Extracted deutschTests"
}

# Add Imports to top of app.js
$imports = "import { flashcardDecks } from './data-flashcards.js';`nimport { deutschTests } from './data-tests.js';`n`n"
$appJs = $imports + $appJs

# Expose all functions to window
$matches = [regex]::Matches($appJs, '(?m)^function\s+([a-zA-Z0-9_]+)\s*\(')
$exposes = "`n// ===== GLOBAL SCOPE BINDINGS (ES MODULE UCHUN) =====`n"
foreach ($match in $matches) {
    $fnName = $match.Groups[1].Value
    $exposes += "window.$fnName = $fnName;`n"
}
$exposes += "window.flashcardDecks = flashcardDecks;`nwindow.deutschTests = deutschTests;`n"
$appJs += $exposes
[System.IO.File]::WriteAllText("app.js", $appJs)
Write-Host "Updated app.js"

# Update index.html and kay.html
$indexHtml = [System.IO.File]::ReadAllText("index.html")
$indexHtml = $indexHtml.Replace('<script src="app.js"></script>', '<script type="module" src="app.js"></script>')
[System.IO.File]::WriteAllText("index.html", $indexHtml)

$kayHtml = [System.IO.File]::ReadAllText("kay.html")
$kayHtml = $kayHtml.Replace('<script src="app.js"></script>', '<script type="module" src="app.js"></script>')
[System.IO.File]::WriteAllText("kay.html", $kayHtml)
Write-Host "Updated html files"

# Update build.mjs
$buildMjs = [System.IO.File]::ReadAllText("build.mjs")
$buildMjs = $buildMjs.Replace(
    "const JS_FILES = ['app.js', 'auth.js', 'i18n.js', 'storage.js', 'sw.js'];", 
    "const JS_FILES = ['data-flashcards.js', 'data-tests.js', 'app.js', 'auth.js', 'i18n.js', 'storage.js', 'sw.js'];"
)
[System.IO.File]::WriteAllText("build.mjs", $buildMjs)
Write-Host "Updated build.mjs"
