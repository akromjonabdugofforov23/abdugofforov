$html = Get-Content "C:\Users\akrom\.gemini\antigravity\scratch\abdugofforov\index.html"

$viewsDir = "C:\Users\akrom\.gemini\antigravity\scratch\abdugofforov\views"
if (!(Test-Path $viewsDir)) { New-Item -ItemType Directory -Force -Path $viewsDir | Out-Null }

$currentView = "main"
$portfolio = @()
$deutsch = @()
$flashcards = @()
$tournament = @()
$mainHtml = @()

foreach ($line in $html) {
    if ($line -match "id="portfolio-view"") { $currentView = "portfolio"; $mainHtml += <div class="container portfolio-container animate-fade-in" id="portfolio-view" style="display: none; padding: 60px 0;"></div> }
    elseif ($line -match "id="deutsch-view"") { $currentView = "deutsch"; $mainHtml += <div class="container animate-fade-in" id="deutsch-view" style="display:none; padding: 40px 0;"></div> }
    elseif ($line -match "id="flashcards-view"") { $currentView = "flashcards"; $mainHtml += <div class="container animate-fade-in" id="flashcards-view" style="display:none; padding: 40px 0;"></div> }
    elseif ($line -match "id="tournament-view"") { $currentView = "tournament"; $mainHtml += <div class="container animate-fade-in" id="tournament-view" style="display:none; padding: 40px 0;"></div> }
    elseif ($line -match "<!-- XAVFSIZLIK VA XATOLIK MODALI -->") { $currentView = "main" }

    if ($currentView -eq "portfolio") { $portfolio += $line }
    elseif ($currentView -eq "deutsch") { $deutsch += $line }
    elseif ($currentView -eq "flashcards") { $flashcards += $line }
    elseif ($currentView -eq "tournament") { $tournament += $line }
    
    if ($currentView -eq "main") { $mainHtml += $line }
}

Set-Content -Path "C:\Users\akrom\.gemini\antigravity\scratch\abdugofforov\views\portfolio.html" -Value $portfolio
Set-Content -Path "C:\Users\akrom\.gemini\antigravity\scratch\abdugofforov\views\deutsch.html" -Value $deutsch
Set-Content -Path "C:\Users\akrom\.gemini\antigravity\scratch\abdugofforov\views\flashcards.html" -Value $flashcards
Set-Content -Path "C:\Users\akrom\.gemini\antigravity\scratch\abdugofforov\views\tournament.html" -Value $tournament
Set-Content -Path "C:\Users\akrom\.gemini\antigravity\scratch\abdugofforov\index.html" -Value $mainHtml

Write-Host "HTML split successfully!"
