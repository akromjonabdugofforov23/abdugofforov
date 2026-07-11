$css = [System.IO.File]::ReadAllText("style.css")

$oldLightMode = '[data-theme="light"] {
    --color-bg-primary:     #EEF1FA;   /* kumush-oq, biroz binafsha tusli */
    --color-bg-secondary:   #E2E8F5;

    --bg-color: var(--color-bg-primary);
    --card-bg: rgba(255, 255, 255, 0.72);
    --text-primary: #0F0F2E;           /* to''q navy */
    --text-secondary: #3E4A63;
    --text-muted: #6B7794;
    --accent-color: #7C3AED;           /* to''qroq binafsha (yorug'' fonda kontrast) */
    --accent-hover: #6D28D9;
    --border-color: rgba(124, 58, 237, 0.22);

    /* Yorug'' fonda yumshoq, lekin yonib turuvchi soyalar */
    --shadow-sm: 0 4px 20px rgba(124, 58, 237, 0.10);
    --shadow-md: 0 10px 30px rgba(59, 130, 246, 0.16);
    --shadow-lg: 0 20px 50px rgba(124, 58, 237, 0.18);
    --glow-purple: 0 0 22px rgba(139, 92, 246, 0.40);
    --glow-blue:   0 0 22px rgba(59, 130, 246, 0.35);

    /* Glass - oqroq, lekin shaffof */
    --glass-bg: rgba(255, 255, 255, 0.55);
    --glass-bg-strong: rgba(255, 255, 255, 0.75);
    --glass-border: rgba(124, 58, 237, 0.18);
    --glass-border-hover: rgba(124, 58, 237, 0.45);

    --navbar-bg: rgba(238, 241, 250, 0.72);
    --modal-bg: rgba(248, 250, 253, 0.97);
    --tag-bg: rgba(124, 58, 237, 0.08);

    --grad-text: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%);
}'

$newLightMode = '[data-theme="light"] {
    --color-bg-primary:     #F8FAFC;   /* Premium Off-White */
    --color-bg-secondary:   #F1F5F9;
    
    /* Silver ranglarni yorug'' rejim uchun to''qlashtirish (Ikonkalar ko''rinishi uchun) */
    --color-silver:         #334155;
    --color-silver-bright:  #0F172A;
    --color-silver-dim:     #64748B;

    --bg-color: var(--color-bg-primary);
    --card-bg: rgba(255, 255, 255, 0.65);
    --text-primary: var(--color-silver-bright);
    --text-secondary: var(--color-silver);
    --text-muted: var(--color-silver-dim);
    --accent-color: #6366F1;           /* Vibrant Indigo */
    --accent-hover: #4F46E5;
    --border-color: rgba(99, 102, 241, 0.15);

    /* Yorug'' fonda yumshoq, lekin yonib turuvchi soyalar */
    --shadow-sm: 0 4px 20px rgba(0, 0, 0, 0.04);
    --shadow-md: 0 10px 30px rgba(0, 0, 0, 0.08);
    --shadow-lg: 0 20px 50px rgba(0, 0, 0, 0.12);
    --glow-purple: 0 0 22px rgba(99, 102, 241, 0.25);
    --glow-blue:   0 0 22px rgba(59, 130, 246, 0.25);

    /* Glass - premium oq shaffof */
    --glass-bg: rgba(255, 255, 255, 0.6);
    --glass-bg-strong: rgba(255, 255, 255, 0.85);
    --glass-border: rgba(255, 255, 255, 0.9);
    --glass-border-hover: rgba(99, 102, 241, 0.4);

    --navbar-bg: rgba(248, 250, 252, 0.75);
    --modal-bg: rgba(255, 255, 255, 0.98);
    --tag-bg: rgba(99, 102, 241, 0.1);

    --grad-text: linear-gradient(135deg, #6366F1 0%, #3B82F6 100%);
}'

$css = $css.Replace($oldLightMode, $newLightMode)

# Hover animatsiyalarini yumshatish
$css = $css -replace 'transition: (.*?) 0\.3s (ease|ease-in-out)', 'transition: $1 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
$css = $css -replace 'transition: (.*?) 0\.25s', 'transition: $1 0.35s cubic-bezier(0.16, 1, 0.3, 1)'

[System.IO.File]::WriteAllText("style.css", $css)
Write-Host "Dizayn xavfsiz yangilandi!"
