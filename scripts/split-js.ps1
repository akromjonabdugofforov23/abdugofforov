$appJs = [System.IO.File]::ReadAllText("app.js")

# 1. Extract flashcardDecks
$fcMatch = [regex]::Match($appJs, '(?s)const flashcardDecks = \{(.*?)\};\s*// ============================================================\s*// NEMIS TILI TESTLARI')
if ($fcMatch.Success) {
    $fcCode = "export const flashcardDecks = {" + $fcMatch.Groups[1].Value + "};"
    [System.IO.File]::WriteAllText("data-flashcards.js", $fcCode)
    $appJs = $appJs.Replace($fcMatch.Value, "// ===== KARTOCHKALAR (FLASHCARDS) OLIb TASHLANDI =====`n`n// ============================================================`n// NEMIS TILI TESTLARI")
    Write-Host "Extracted flashcards"
} else {
    Write-Host "Could not find flashcards block"
}

# 2. Extract deutschTests
$testMatch = [regex]::Match($appJs, '(?s)const deutschTests = \{(.*?)\};\s*// ============================================================\s*// PORTFOLIO SAHIFASI')
if ($testMatch.Success) {
    $testCode = "export const deutschTests = {" + $testMatch.Groups[1].Value + "};"
    [System.IO.File]::WriteAllText("data-tests.js", $testCode)
    $appJs = $appJs.Replace($testMatch.Value, "// ===== NEMIS TESTLARI OLIB TASHLANDI =====`n`n// ============================================================`n// PORTFOLIO SAHIFASI")
    Write-Host "Extracted deutschTests"
} else {
    Write-Host "Could not find deutschTests block"
}

# 3. Add Imports to top of app.js
$imports = "import { flashcardDecks } from './data-flashcards.js';`nimport { deutschTests } from './data-tests.js';`n`n"
$appJs = $imports + $appJs

# 4. Expose all functions to window
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

# 5. Update index.html and kay.html
$indexHtml = [System.IO.File]::ReadAllText("index.html")
$indexHtml = $indexHtml.Replace('<script src="app.js"></script>', '<script type="module" src="app.js"></script>')
[System.IO.File]::WriteAllText("index.html", $indexHtml)

$kayHtml = [System.IO.File]::ReadAllText("kay.html")
$kayHtml = $kayHtml.Replace('<script src="app.js"></script>', '<script type="module" src="app.js"></script>')
[System.IO.File]::WriteAllText("kay.html", $kayHtml)
Write-Host "Updated html files"

# 6. Update build.mjs
$buildMjs = [System.IO.File]::ReadAllText("build.mjs")
$buildMjs = $buildMjs.Replace(
    "const JS_FILES = ['app.js', 'auth.js', 'i18n.js', 'storage.js', 'sw.js'];", 
    "const JS_FILES = ['data-flashcards.js', 'data-tests.js', 'app.js', 'auth.js', 'i18n.js', 'storage.js', 'sw.js'];"
)
[System.IO.File]::WriteAllText("build.mjs", $buildMjs)
Write-Host "Updated build.mjs"
