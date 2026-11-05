#!/usr/bin/env pwsh
# Levanta el harness completo de .NET Aspire (SQL Server + Redis + Backend API + Frontend).
# Uso: .\scripts\dev.ps1   (desde cualquier carpeta del repo)

$repoRoot = Split-Path -Parent $PSScriptRoot
$appHostProject = Join-Path $repoRoot "harness\ProyectoFullstack.AppHost\ProyectoFullstack.AppHost.csproj"

docker info *> $null
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Docker no responde. Abre Docker Desktop antes de continuar (Aspire necesita los contenedores de SQL Server y Redis)."
    exit 1
}

dotnet run --project $appHostProject
