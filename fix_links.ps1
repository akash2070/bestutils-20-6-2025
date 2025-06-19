# PowerShell script to fix broken links in template files
$templateDir = "best-tools/templates"
$htmlFiles = Get-ChildItem -Path $templateDir -Filter "*.html" -Recurse

foreach ($file in $htmlFiles) {
    Write-Host "Processing: $($file.FullName)"
    
    # Read file content
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # Fix contact.html -> contact-us.html
    $content = $content -replace 'href="../contact\.html"', 'href="contact-us.html"'
    
    # Fix terms-conditions.html -> terms-of-use.html
    $content = $content -replace 'href="../terms-conditions\.html"', 'href="../terms-of-use.html"'
    
    # Fix privacy-policy.html (this one is correct, but let's make sure it's consistent)
    $content = $content -replace 'href="../privacy-policy\.html"', 'href="../privacy-policy.html"'
    
    # Write back to file
    Set-Content $file.FullName -Value $content -Encoding UTF8
    
    Write-Host "Fixed links in: $($file.Name)"
}

Write-Host "All template files have been updated!" 