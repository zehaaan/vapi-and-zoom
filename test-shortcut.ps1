# Create WScript.Shell object
$wshell = New-Object -ComObject wscript.shell

Write-Host "Testing keyboard simulation..."
Write-Host "Sending Left Shift + F..."

# Try different methods
Write-Host "Method 1: Using SendKeys with +f"
$wshell.SendKeys("+f")
Start-Sleep -Seconds 1

Write-Host "Method 2: Using SendKeys with {LSHIFT}f"
$wshell.SendKeys("{LSHIFT}f")
Start-Sleep -Seconds 1

Write-Host "Method 3: Using SendKeys with %f"
$wshell.SendKeys("%f")
Start-Sleep -Seconds 1

Write-Host "All methods tested" 