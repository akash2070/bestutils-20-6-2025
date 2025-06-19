# PowerShell script to fix PDF converter links in template files
$templateDir = "best-tools/templates"
$htmlFiles = Get-ChildItem -Path $templateDir -Filter "*.html" -Recurse

foreach ($file in $htmlFiles) {
    Write-Host "Processing: $($file.FullName)"
    
    # Read file content
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # Fix pdf-converter.html -> pdf_converter.html
    $content = $content -replace 'href="pdf-converter\.html"', 'href="pdf_converter.html"'
    
    # Write back to file
    Set-Content $file.FullName -Value $content -Encoding UTF8
    
    Write-Host "Fixed PDF links in: $($file.Name)"
}

Write-Host "All PDF converter links have been updated!" 