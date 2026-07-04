$appJsPath = Join-Path $PWD "app.js"
$jsDir = Join-Path $PWD "js"
$content = [System.IO.File]::ReadAllText($appJsPath)

function Extract-Between($startMarker, $endMarker) {
    $startIndex = $content.IndexOf($startMarker)
    if ($startIndex -eq -1) { 
        Write-Error "Start marker not found: $startMarker"
        return "" 
    }
    
    $endIndex = $content.Length
    if ($endMarker) {
        $endIndex = $content.IndexOf($endMarker, $startIndex)
        if ($endIndex -eq -1) { 
            Write-Error "End marker not found: $endMarker"
            $endIndex = $content.Length 
        }
    }
    
    $length = $endIndex - $startIndex
    return $content.Substring($startIndex, $length).Trim()
}

$admin = Extract-Between "// ===== ADMIN PIN AUTHENTICATION =====" "// ===== PORTFOLIO VIEW ====="
[System.IO.File]::WriteAllText((Join-Path $jsDir "admin.js"), $admin)

$navigation = Extract-Between "// ===== SPA NAVIGATION =====" "// ===== LIKE HANDLING ====="
[System.IO.File]::WriteAllText((Join-Path $jsDir "navigation.js"), $navigation)

$deutschData = Extract-Between "// NEMIS TILI TEST BAZASI (DATA)" "// NEMIS TILI TEST ENGINE"
[System.IO.File]::WriteAllText((Join-Path $jsDir "deutsch-data.js"), $deutschData)

$deutschEngine = Extract-Between "// NEMIS TILI TEST ENGINE" "// TURNIR TIZIMI"
[System.IO.File]::WriteAllText((Join-Path $jsDir "deutsch.js"), $deutschEngine)

$tournament = Extract-Between "// TURNIR TIZIMI" "// ===== AUTH UI ====="
[System.IO.File]::WriteAllText((Join-Path $jsDir "tournament.js"), $tournament)

$flashcards = Extract-Between "// ===== FLASHCARDS DATA =====" "// ===== TIL / i18n ====="
[System.IO.File]::WriteAllText((Join-Path $jsDir "flashcards.js"), $flashcards)

$particles = Extract-Between "// ===== HERO PARTICLES (CANVAS) =====" "// ===== GERMANY CAROUSEL ====="
[System.IO.File]::WriteAllText((Join-Path $jsDir "particles.js"), $particles)

$introSplash = Extract-Between "// ===== INTRO SPLASH ANIMATION =====" "// ===== SCROLL REVEAL ====="
$scrollReveal = Extract-Between "// ===== SCROLL REVEAL =====" "// ===== FLOATING ADD BUTTON ====="
$carousel = Extract-Between "// ===== GERMANY CAROUSEL =====" "// ===== HERO TYPEWRITER ====="
$typewriter = Extract-Between "// ===== HERO TYPEWRITER =====" "// ===== 3D TILT EFFECT ====="
$tilt = Extract-Between "// ===== 3D TILT EFFECT =====" "// ===== BOOTSTRAP ====="
$animations = "$introSplash`n`n$scrollReveal`n`n$carousel`n`n$typewriter`n`n$tilt"
[System.IO.File]::WriteAllText((Join-Path $jsDir "animations.js"), $animations)

$authUi = Extract-Between "// ===== AUTH UI =====" "// Bootstrap ni o'chiramiz yoki oxiri"
if ([string]::IsNullOrWhiteSpace($authUi)) {
    # If end marker not found or something else, let's just use the EOF version
    $authUi = Extract-Between "// ===== AUTH UI =====" $null
}
[System.IO.File]::WriteAllText((Join-Path $jsDir "auth-ui.js"), $authUi)

$saveSync = Extract-Between "// 6. Ma'lumotlarni saqlash" "// 7. Hero qismini yangilash"
$postRender = Extract-Between "// 8. Maqolalarni ko'rsatish (Render)" "// ===== AUXILIARY VIEWS ====="
$likeHandle = Extract-Between "// ===== LIKE HANDLING =====" "// 10. Batafsil ko'rish (Modal)"
$postDetail = Extract-Between "// 10. Batafsil ko'rish (Modal)" "// 11. Yangi Post Qo'shish / Tahrirlash Formasi"
$postForm = Extract-Between "// 11. Yangi Post Qo'shish / Tahrirlash Formasi" "// ===== ADMIN PIN AUTHENTICATION ====="
$lightbox = Extract-Between "// ===== RASM LIGHTBOX" "// ===== DOIMIY MUSIQA PLEYERI ====="
$commentReply = Extract-Between "// ===== COMMENT REPLY =====" "// ===== TEST RESULTS HISTORY ====="

$posts = "$saveSync`n`n$postRender`n`n$likeHandle`n`n$postDetail`n`n$postForm`n`n$lightbox`n`n$commentReply"
[System.IO.File]::WriteAllText((Join-Path $jsDir "posts.js"), $posts)

Write-Host "Barcha modullar ajratildi! (V2)"
