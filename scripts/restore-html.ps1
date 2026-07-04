$htmlFiles = @('deutsch.html', 'flashcards.html', 'tournament.html', 'index.html')

foreach ($file in $htmlFiles) {
    $content = [System.IO.File]::ReadAllText((Join-Path $PWD $file))
    
    # Restore app.js script tags
    $content = $content -replace '(?s)<script src="js/state\.js"></script>.*?<script src="js/bootstrap\.js"></script>', '<script src="app.js"></script>'
    
    [System.IO.File]::WriteAllText((Join-Path $PWD $file), $content)
}

Write-Host "HTML sahifalar app.js ga qaytarildi!"
