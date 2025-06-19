# Fix links in all template HTML files to use correct relative path
$templateDir = "best-tools/templates"
$htmlFiles = Get-ChildItem -Path $templateDir -Filter "*.html" -Recurse

foreach ($file in $htmlFiles) {
    Write-Host "Processing: $($file.FullName)"
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    # Fix contact-us links
    $content = $content -replace 'href="(\.\./)?contact(-us)?\.html"', 'href="contact-us.html"'
    # Fix pdf_converter links
    $content = $content -replace 'href="(\.\./)?pdf(_|-)converter\.html"', 'href="pdf_converter.html"'
    Set-Content $file.FullName -Value $content -Encoding UTF8
    Write-Host "Fixed template links in: $($file.Name)"
}
Write-Host "All template files have been updated!" 