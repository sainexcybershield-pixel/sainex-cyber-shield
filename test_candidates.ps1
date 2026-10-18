$testUrls = @{
  "commit-turnkey" = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80"
  "commit-preventative" = "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=600&q=80"
  "commit-preventative-alt" = "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=600&q=80"
}

foreach ($k in $testUrls.Keys) {
  $u = $testUrls[$k]
  try {
    $r = Invoke-WebRequest -Uri $u -Method Head -UseBasicParsing -TimeoutSec 5
    Write-Output "OK: $k -> $($r.StatusCode)"
  } catch {
    Write-Output "FAIL: $k -> $($_.Exception.Message)"
  }
}
