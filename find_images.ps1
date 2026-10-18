$content = Get-Content 'C:\Users\gs\.gemini\antigravity\scratch\sainex-cyber-shield\index.html' -Raw
$matches = [regex]::Matches($content, '<img[^>]+src=["'']([^"'']+)["'']')
foreach ($m in $matches) {
    Write-Output $m.Groups[1].Value
}
