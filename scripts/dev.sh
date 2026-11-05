#!/usr/bin/env bash
# Levanta el harness completo de .NET Aspire (SQL Server + Redis + Backend API + Frontend).
# Uso: ./scripts/dev.sh   (desde cualquier carpeta del repo)
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
app_host_project="$repo_root/harness/ProyectoFullstack.AppHost/ProyectoFullstack.AppHost.csproj"

if ! docker info >/dev/null 2>&1; then
  echo "Docker no responde. Abre Docker Desktop antes de continuar (Aspire necesita los contenedores de SQL Server y Redis)." >&2
  exit 1
fi

dotnet run --project "$app_host_project"
