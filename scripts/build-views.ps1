$jsContent = "window.AppViews = {};`n";
foreach ($file in Get-ChildItem "C:\Users\akrom\.gemini\antigravity\scratch\abdugofforov\views\*.html") {
    $name = $file.BaseName;
    $content = Get-Content $file.FullName -Raw -Encoding UTF8;
    $escaped = $content.Replace('\', '\\').Replace('"', '\"').Replace("`r", "").Replace("`n", "\n");
    $jsContent += "window.AppViews['$name'] = "$escaped";`n"
}
Set-Content "C:\Users\akrom\.gemini\antigravity\scratch\abdugofforov\views.js" -Value $jsContent -Encoding UTF8;
Write-Host "views.js successfully built!"
