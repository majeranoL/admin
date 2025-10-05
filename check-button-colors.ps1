# PowerShell script to identify and fix any remaining button color issues

Write-Host "🔍 Searching for remaining button color issues..."

# Check for any remaining hardcoded button colors that might affect light mode
$buttonColorPatterns = @(
    "background:\s*#[0-9a-f]{6}.*btn",
    "\.btn.*background:\s*#[0-9a-f]{6}",
    "background:\s*#[2-5][0-9a-f]{5}.*button",
    "button.*background:\s*#[2-5][0-9a-f]{5}"
)

Write-Host "✅ Checking all CSS files for button color patterns..."

# Get all CSS files
$cssFiles = Get-ChildItem -Path "c:\Users\Mark\Desktop\Animal911 - Web\admin\src\css" -Recurse -Filter "*.css"

$foundIssues = @()

foreach ($file in $cssFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Check for specific problem patterns
    if ($content -match 'background:\s*#[2-6][0-9a-f]{5}' -and $content -match 'btn|button') {
        $foundIssues += $file.FullName
    }
}

Write-Host "🎯 Button color analysis complete!"
Write-Host ""
Write-Host "📊 SUMMARY:"
Write-Host "- Files checked: $($cssFiles.Count)"

if ($foundIssues.Count -gt 0) {
    Write-Host "- Files with potential issues: $($foundIssues.Count)"
    Write-Host ""
    Write-Host "🔧 Files that might need attention:"
    foreach ($issue in $foundIssues) {
        Write-Host "  - $issue"
    }
} else {
    Write-Host "- No obvious button color issues found! ✅"
}

Write-Host ""
Write-Host "✅ Analysis complete! Check the development server at localhost:5173"
Write-Host "🎨 Toggle between light and dark themes to verify button visibility"