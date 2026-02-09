# Simple Splash Screen Creator for AyuMitra
# This creates a basic white background splash with your logo centered

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AyuMitra Splash Screen Creator" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "OPTION 1: Use Online Tool (Recommended)" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Go to: https://www.appicon.co/" -ForegroundColor White
Write-Host "2. Click 'Splash Screen Generator'" -ForegroundColor White
Write-Host "3. Upload: LOGO\1024.png" -ForegroundColor White
Write-Host "4. Choose background color (white or blue)" -ForegroundColor White
Write-Host "5. Download and extract" -ForegroundColor White
Write-Host "6. Copy splash.png files to:" -ForegroundColor White
Write-Host "   android\app\src\main\res\drawable-*\" -ForegroundColor Cyan
Write-Host ""

Write-Host "OPTION 2: Quick Copy (Use Existing)" -ForegroundColor Yellow
Write-Host "------------------------------------" -ForegroundColor Yellow
Write-Host ""
Write-Host "If you want to quickly use your logo as splash:" -ForegroundColor White
Write-Host ""

$response = Read-Host "Do you want to copy your logo (1024.png) as splash screen? (y/n)"

if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host ""
    Write-Host "Copying logo to splash screen locations..." -ForegroundColor Cyan
    
    $logoPath = "LOGO\1024.png"
    
    if (-not (Test-Path $logoPath)) {
        Write-Host "✗ Logo file not found: $logoPath" -ForegroundColor Red
        exit 1
    }
    
    $folders = @(
        "android\app\src\main\res\drawable",
        "android\app\src\main\res\drawable-land-hdpi",
        "android\app\src\main\res\drawable-land-mdpi",
        "android\app\src\main\res\drawable-land-xhdpi",
        "android\app\src\main\res\drawable-land-xxhdpi",
        "android\app\src\main\res\drawable-land-xxxhdpi",
        "android\app\src\main\res\drawable-port-hdpi",
        "android\app\src\main\res\drawable-port-mdpi",
        "android\app\src\main\res\drawable-port-xhdpi",
        "android\app\src\main\res\drawable-port-xxhdpi",
        "android\app\src\main\res\drawable-port-xxxhdpi"
    )
    
    $copiedCount = 0
    
    foreach ($folder in $folders) {
        $destPath = "$folder\splash.png"
        
        if (Test-Path $folder) {
            Copy-Item $logoPath $destPath -Force
            Write-Host "✓ Copied to: $folder" -ForegroundColor Green
            $copiedCount++
        } else {
            Write-Host "✗ Folder not found: $folder" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Splash Screen Updated!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Files updated: $copiedCount" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️ Note: Logo will be stretched to fit screen" -ForegroundColor Yellow
    Write-Host "For better results, use Option 1 (online tool)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. npm run build" -ForegroundColor White
    Write-Host "  2. npx cap sync android" -ForegroundColor White
    Write-Host "  3. npx cap open android" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "No problem! Use Option 1 (online tool) for best results." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Visit: https://www.appicon.co/" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "For detailed instructions, see: CREATE_SPLASH_SCREEN.md" -ForegroundColor Cyan
Write-Host ""
