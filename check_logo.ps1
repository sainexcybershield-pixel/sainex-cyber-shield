Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\gs\.gemini\antigravity\scratch\sainex-cyber-shield\assets\logo.png"
$img = [System.Drawing.Image]::FromFile($srcPath)
Write-Host "Width: $($img.Width) Height: $($img.Height)"

$bmp = New-Object System.Drawing.Bitmap($img)
$p = $bmp.GetPixel(0, 0)
Write-Host "Corner pixel: R=$($p.R) G=$($p.G) B=$($p.B) A=$($p.A)"

# Create a transparent version where white background (> 240, 240, 240) becomes transparent
$transparentBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($x = 0; $x -lt $bmp.Width; $x++) {
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        $c = $bmp.GetPixel($x, $y)
        # If nearly white, make transparent or smooth alpha
        if ($c.R -gt 245 -and $c.G -gt 245 -and $c.B -gt 245) {
            $transparentBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($c.R -gt 225 -and $c.G -gt 225 -and $c.B -gt 225) {
            # anti-aliasing edge blend
            $factor = [Math]::Max(0, (255 - (($c.R + $c.G + $c.B) / 3)) / 30.0)
            $alpha = [int]($factor * 255)
            $transparentBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
        } else {
            $transparentBmp.SetPixel($x, $y, $c)
        }
    }
}

$destPath = "C:\Users\gs\.gemini\antigravity\scratch\sainex-cyber-shield\assets\logo-transparent.png"
$transparentBmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Transparent logo saved to $destPath"

$img.Dispose()
$bmp.Dispose()
$transparentBmp.Dispose()
