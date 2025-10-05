# PowerShell script to identify remaining button color issues

Write-Host "🔍 Searching for remaining button color issues..."

# Get all CSS files
$cssFiles = Get-ChildItem -Path "c:\Users\Mark\Desktop\Animal911 - Web\admin\src\css" -Recurse -Filter "*.css"

$foundIssues = @()

foreach ($file in $cssFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Check for hardcoded colors that might be buttons
    if ($content -match 'background:\s*#[2-6][0-9a-f]{5}' -and $content -match 'btn') {
        $foundIssues += $file.FullName
    }
}

Write-Host "✅ Button color analysis complete!"
Write-Host ""
Write-Host "📊 SUMMARY:"
Write-Host "- Files checked: $($cssFiles.Count)"

if ($foundIssues.Count -gt 0) {
    Write-Host "- Files with potential button issues: $($foundIssues.Count)"
    Write-Host ""
    Write-Host "Files that might need attention:"
    foreach ($issue in $foundIssues) {
        Write-Host "  - $issue"
    }
} else {
    Write-Host "- No obvious button color issues found!"
}

Write-Host ""
Write-Host "✅ Analysis complete! Check localhost:5174"
Write-Host "Toggle between light and dark themes to verify button visibility"