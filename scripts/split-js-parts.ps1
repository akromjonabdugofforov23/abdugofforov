$appJs = Get-Content "C:\Users\akrom\.gemini\antigravity\scratch\abdugofforov\app.js"

$ui = @()
$blog = @()
$flashcards = @()
$tests = @()
$tournament = @()
$particles = @()
$core = @()

$current = "core"

foreach ($line in $appJs) {
    if ($line -match "// ===== HERO PARTICLES") { $current = "particles" }
    elseif ($line -match "// ===== GERMANY CAROUSEL") { $current = "core" }
    elseif ($line -match "// ===== KARTOCHKALAR HOLATI VA KO'RINISHI") { $current = "flashcards" }
    elseif ($line -match "// ===== TIL \(i18n\) BOSHQARUVI") { $current = "core" }
    elseif ($line -match "// ===== FLASHCARD - SPACED REPETITION") { $current = "flashcards" }
    elseif ($line -match "// ===== HERO PARTICLES") { $current = "particles" }
    elseif ($line -match "// ===== DEUTSCH TESTLAR") { $current = "tests" }
    elseif ($line -match "// ===== TURNIR \(TOURNAMENT\) LOGIKASI") { $current = "tournament" }
    elseif ($line -match "// ===== AUTH VA USER PROFILI") { $current = "core" }
    
    switch ($current) {
        "particles" { $particles += $line }
        "flashcards" { $flashcards += $line }
        "tests" { $tests += $line }
        "tournament" { $tournament += $line }
        "core" { $core += $line }
    }
}

Set-Content -Path "C:\Users\akrom\.gemini\antigravity\scratch\abdugofforov\scripts\particles.js" -Value $particles
Set-Content -Path "C:\Users\akrom\.gemini\antigravity\scratch\abdugofforov\scripts\flashcards.js" -Value $flashcards
Set-Content -Path "C:\Users\akrom\.gemini\antigravity\scratch\abdugofforov\scripts\tests.js" -Value $tests
Set-Content -Path "C:\Users\akrom\.gemini\antigravity\scratch\abdugofforov\scripts\tournament.js" -Value $tournament
Set-Content -Path "C:\Users\akrom\.gemini\antigravity\scratch\abdugofforov\app.js" -Value $core

Write-Host "JS split successful!"
