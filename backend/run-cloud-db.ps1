# Script to load backend/.env and launch Spring Boot with Cloud PostgreSQL
$EnvFilePath = Join-Path $PSScriptRoot ".env"

if (Test-Path $EnvFilePath) {
    Write-Host "Loading environment variables from $EnvFilePath..." -ForegroundColor Cyan
    Get-Content $EnvFilePath | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#")) {
            $parts = $line -split "=", 2
            if ($parts.Count -eq 2) {
                $name = $parts[0].Trim()
                $value = $parts[1].Trim()
                [System.Environment]::SetEnvironmentVariable($name, $value, "Process")
                Write-Host "  -> Loaded $name" -ForegroundColor Gray
            }
        }
    }
} else {
    Write-Warning "No backend\.env file found! Please create backend\.env from .env.example with your Neon DB credentials."
}

Write-Host "`nStarting Spring Boot Backend with Cloud PostgreSQL ($env:DB_URL)...`n" -ForegroundColor Green
Set-Location $PSScriptRoot
mvn spring-boot:run
