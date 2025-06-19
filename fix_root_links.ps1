# Fix links in all root HTML files to use correct path to templates/contact-us.html and templates/pdf_converter.html
$rootDir = "best-tools"
$htmlFiles = Get-ChildItem -Path $rootDir -Filter "*.html" | Where-Object { $_.DirectoryName -notlike "*templates*" }

foreach ($file in $htmlFiles) {
    Write-Host "Processing: $($file.FullName)"
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    # Fix contact-us links
    $content = $content -replace 'href="(\.\./)?contact(-us)?\.html"', 'href="templates/contact-us.html"'
    # Fix pdf_converter links
    $content = $content -replace 'href="(\.\./)?pdf(_|-)converter\.html"', 'href="templates/pdf_converter.html"'
    Set-Content $file.FullName -Value $content -Encoding UTF8
    Write-Host "Fixed root links in: $($file.Name)"
}
Write-Host "All root files have been updated!" 