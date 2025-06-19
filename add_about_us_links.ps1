# PowerShell script to add "About Us" links to all template HTML files
$templateDir = "best-tools/templates"
$htmlFiles = Get-ChildItem -Path $templateDir -Filter "*.html" -Recurse

foreach ($file in $htmlFiles) {
    Write-Host "Processing: $($file.FullName)"
    
    # Read file content
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # Add About Us link after Contact Us link in the footer
    # Look for the pattern: Contact Us</a> and add About Us after it
    $content = $content -replace '(href="contact-us\.html"[^>]*>Contact Us</a>)', '$1
                    <a href="about-us.html" style="color: white; text-decoration: none; opacity: 0.9; transition: opacity 0.3s;">About Us</a>'
    
    # Write back to file
    Set-Content $file.FullName -Value $content -Encoding UTF8
    
    Write-Host "Added About Us link to: $($file.Name)"
}

Write-Host "All template files have been updated with About Us links!" 