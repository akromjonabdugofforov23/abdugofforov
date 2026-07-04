$htmlFiles = @('deutsch.html', 'flashcards.html', 'tournament.html', 'index.html')

foreach ($file in $htmlFiles) {
    $content = [System.IO.File]::ReadAllText((Join-Path $PWD $file))
    
    # 1. Update Scripts tag
    $newScripts = @"
    <script src="storage.js"></script>
    <script src="i18n.js"></script>
    <script src="auth.js"></script>
    <script src="js/state.js"></script>
    <script src="js/utils.js"></script>
    <script src="js/theme.js"></script>
    <script src="js/clock.js"></script>
    <script src="js/mouse-follower.js"></script>
    <script src="js/auth-ui.js"></script>
"@
    
    if ($file -eq 'index.html') {
        $newScripts += @"
`n    <script src="js/particles.js"></script>
    <script src="js/animations.js"></script>
    <script src="js/music-player.js"></script>
    <script src="js/navigation.js"></script>
    <script src="js/posts.js"></script>
    <script src="js/bootstrap.js"></script>
"@
    } elseif ($file -eq 'deutsch.html') {
        $newScripts += @"
`n    <script src="js/deutsch-data.js"></script>
    <script src="js/deutsch.js"></script>
    <script src="js/bootstrap.js"></script>
"@
    } elseif ($file -eq 'flashcards.html') {
        $newScripts += @"
`n    <script src="js/flashcards.js"></script>
    <script src="js/bootstrap.js"></script>
"@
    } elseif ($file -eq 'tournament.html') {
        $newScripts += @"
`n    <script src="js/deutsch-data.js"></script>
    <script src="js/flashcards.js"></script>
    <script src="js/tournament.js"></script>
    <script src="js/bootstrap.js"></script>
"@
    }
    
    $content = $content -replace '(?s)<script src="storage\.js"></script>.*?<script src="app\.js"></script>', $newScripts
    
    # 2. Update navigation active state
    $content = $content -replace 'class="active" data-page="home"', 'data-page="home"'
    $content = $content -replace 'class="active" data-page="projects"', 'data-page="projects"'
    
    if ($file -eq 'index.html') {
        $content = $content -replace 'id="nav-home-link" aria-label="Bosh sahifa"', 'class="active" id="nav-home-link" aria-label="Bosh sahifa"'
        
        # Remove other views from index.html
        $content = $content -replace '(?s)<!-- Deutsch Test Sahifasi -->.*?</div>\s*<!-- Kartochkalar', '<!-- Kartochkalar'
        $content = $content -replace '(?s)<!-- Kartochkalar \(Flashcards\) Sahifasi -->.*?</div>\s*<!-- Turnir', '<!-- Turnir'
        $content = $content -replace '(?s)<!-- Turnir Sahifasi -->.*?</div>\s*<main', '<main'
    }
    
    if ($file -eq 'deutsch.html') {
        # Keep only Deutsch view
        $content = $content -replace '(?s)<!-- Kartochkalar \(Flashcards\) Sahifasi -->.*?</div>\s*<!-- Turnir', '<!-- Turnir'
        $content = $content -replace '(?s)<!-- Turnir Sahifasi -->.*?</div>\s*<main', '<main'
        $content = $content -replace '(?s)<main.*?</main>', ''
        $content = $content -replace '(?s)<!-- Yashirin Portfolio Sahifasi -->.*?</div>\s*<!-- Asosiy', '<!-- Asosiy'
        $content = $content -replace '(?s)<!-- Germany Carousel -->.*?</section>', ''
        $content = $content -replace '(?s)<!-- Floating "\+" tugma.*?</button>', ''
    }
    
    if ($file -eq 'flashcards.html') {
        # Keep only flashcards
        $content = $content -replace '(?s)<!-- Deutsch Test Sahifasi -->.*?</div>\s*<!-- Kartochkalar', '<!-- Kartochkalar'
        $content = $content -replace '(?s)<!-- Turnir Sahifasi -->.*?</div>\s*<main', '<main'
        $content = $content -replace '(?s)<main.*?</main>', ''
        $content = $content -replace '(?s)<!-- Yashirin Portfolio Sahifasi -->.*?</div>\s*<!-- Asosiy', '<!-- Asosiy'
        $content = $content -replace '(?s)<!-- Germany Carousel -->.*?</section>', ''
        $content = $content -replace '(?s)<!-- Floating "\+" tugma.*?</button>', ''
    }
    
    if ($file -eq 'tournament.html') {
        # Keep only tournament
        $content = $content -replace '(?s)<!-- Deutsch Test Sahifasi -->.*?</div>\s*<!-- Kartochkalar', '<!-- Kartochkalar'
        $content = $content -replace '(?s)<!-- Kartochkalar \(Flashcards\) Sahifasi -->.*?</div>\s*<!-- Turnir', '<!-- Turnir'
        $content = $content -replace '(?s)<main.*?</main>', ''
        $content = $content -replace '(?s)<!-- Yashirin Portfolio Sahifasi -->.*?</div>\s*<!-- Asosiy', '<!-- Asosiy'
        $content = $content -replace '(?s)<!-- Germany Carousel -->.*?</section>', ''
        $content = $content -replace '(?s)<!-- Floating "\+" tugma.*?</button>', ''
    }
    
    [System.IO.File]::WriteAllText((Join-Path $PWD $file), $content)
}

Write-Host "HTML sahifalar muvaffaqiyatli sozlandi!"
