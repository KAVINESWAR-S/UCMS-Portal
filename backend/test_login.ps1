$bodyObj = @{
    email = "admin@ucms.gov.in"
    password = "Admin@123"
}
$json = $bodyObj | ConvertTo-Json
$res = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/auth/login" -Method Post -ContentType "application/json" -Body $json
Write-Output "SUCCESS: $($res.success), ROLE: $($res.user.role), TOKEN_LEN: $($res.token.Length)"
