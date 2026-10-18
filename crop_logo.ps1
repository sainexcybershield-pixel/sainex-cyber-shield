Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\gs\.gemini\antigravity\scratch\sainex-cyber-shield\assets\logo-transparent.png"
$bmp = New-Object System.Drawing.Bitmap($srcPath)

$minX = $bmp.Width
$minY = $bmp.Height
$maxX = 0
$maxY = 0

for ($x = 0; $x -lt $bmp.Width; $x++) {
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.A -gt 20) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Bounding box: minX=$minX, minY=$minY, maxX=$maxX, maxY=$maxY"

$cropW = $maxX - $minX + 1
$cropH = $maxY - $minY + 1
Write-Host "Cropped size: ${cropW}x${cropH}"

$cropRect = New-Object System.Drawing.Rectangle($minX, $minY, $cropW, $cropH)
$croppedBmp = $bmp.Clone($cropRect, $bmp.PixelFormat)

$croppedPath = "C:\Users\gs\.gemini\antigravity\scratch\sainex-cyber-shield\assets\logo-clean.png"
$croppedBmp.Save($croppedPath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Clean cropped logo saved to $croppedPath"

# Also save a 64x64 favicon / icon badge
$iconSize = 64
$iconBmp = New-Object System.Drawing.Bitmap($iconSize, $iconSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($iconBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Fit preserving aspect ratio
$scale = [Math]::Min($iconSize / $cropW, $iconSize / $cropH)
$destW = [int]($cropW * $scale)
$destH = [int]($cropH * $scale)
$destX = [int](($iconSize - $destW) / 2)
$destY = [int](($iconSize - $destH) / 2)

$g.DrawImage($croppedBmp, $destX, $destY, $destW, $destH)
$iconPath = "C:\Users\gs\.gemini\antigravity\scratch\sainex-cyber-shield\assets\favicon.png"
$iconBmp.Save($iconPath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Favicon saved to $iconPath"

$g.Dispose()
$iconBmp.Dispose()
$croppedBmp.Dispose()
$bmp.Dispose()
