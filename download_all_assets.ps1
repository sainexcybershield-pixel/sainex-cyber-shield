$baseDir = "C:\Users\gs\.gemini\antigravity\scratch\sainex-cyber-shield\assets"

$downloads = @{
  "advantage-operations.jpg" = "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80"
  "commit-sla.jpg"           = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80"
  "commit-spares.jpg"        = "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80"
  "commit-oem.jpg"           = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
  "commit-turnkey.jpg"       = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80"
  "commit-privacy.jpg"       = "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80"
  "commit-preventative.jpg"  = "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=600&q=80"
  "ind-textile.jpg"          = "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80"
  "ind-diamond.jpg"          = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
  "ind-corporate.jpg"        = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
  "ind-retail.jpg"           = "https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=800&q=80"
  "ind-logistics.jpg"        = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"
  "ind-township.jpg"         = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
}

foreach ($fileName in $downloads.Keys) {
  $target = Join-Path $baseDir $fileName
  $url = $downloads[$fileName]
  try {
    Write-Host "Downloading $fileName ..."
    Invoke-WebRequest -Uri $url -OutFile $target -UseBasicParsing -TimeoutSec 15
    $bytes = (Get-Item $target).Length
    Write-Host "SUCCESS: $fileName ($bytes bytes)"
  } catch {
    Write-Error "FAILED: $fileName - $($_.Exception.Message)"
  }
}
