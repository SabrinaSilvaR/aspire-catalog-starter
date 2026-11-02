# 🚀 Proyecto Fullstack: Monorepo con Harness de Orquestación (.NET Aspire)

> **Monorepo empresarial de grado de producción** que orquesta un stack completo: **Frontend** (React 19 + Vite + TypeScript), **Backend API** (Clean Architecture + FastEndpoints en .NET 10), **Persistencia Relacional** (Microsoft SQL Server 2022 con EF Core), **Caché Distribuido** (Redis 7), orquestado todo mediante **.NET Aspire 9.0 AppHost**, y gobernado por un equipo de **Agentes de IA** bajo metodología Spec-Driven Development (OpenSpec SDD).

---

## 🌟 Características del Ecosistema

- **🚀 Orquestación con .NET Aspire 9.0**:
  - Levanta y coordina con un solo comando: SQL Server, Redis, la API de Backend y el Frontend React.
  - **Dashboard Web interactivo** en `http://localhost:18888` con métricas, trazas OpenTelemetry y logs consolidados en tiempo real.
  - **Inyección automática de conexiones**: Las cadenas de conexión a base de datos y Redis, así como la URL de la API hacia el frontend, se resuelven dinámicamente sin tocar archivos `.env`.
- **🌐 Frontend Moderno (React + Vite + TypeScript)**:
  - Single Page Application con React, Vite y TypeScript estricto.
  - Proxy inteligente hacia la API provista por Aspire.
  - Interfaz de catálogo en tiempo real con indicador de caché hit (*Redis*) vs lectura en base de datos (*SQL Server*).
- **⚙️ Backend Empresarial (FastEndpoints + Clean Architecture + .NET 10)**:
  - Arquitectura limpia en 4 capas (`Domain`, `Application`, `Infrastructure`, `Api`) + `ServiceDefaults`.
  - Endpoints bajo el patrón REPR (*Request-Endpoint-Response*).
  - Aceleración con Redis e invalidación atómica de caché.
  - Documentación interactiva Swagger OpenAPI en `/swagger` y `/openapi/v1.json`.
- **🤖 Ecosistema Multi-Agente de IA**:
  - `AGENTS.md`: Protocolo maestro de desarrollo colaborativo para agentes autónomos.
  - `.agent/roles/`: 4 roles especializados con límites estrictos para evitar colisiones:
    - `spec-architect.md`: Define contratos y modelos en `specs/` antes de codificar.
    - `dotnet-backend-expert.md`: Implementa endpoints, EF Core y Redis en `src/`.
    - `frontend-expert.md`: Desarrolla componentes y vistas en `frontend/`.
    - `qa-guardian.md`: Audita calidad, pruebas y cumplimiento de SLAs.

---

## 📁 Estructura del Repositorio

```
proyecto-fullstack-harness/
├── .agent/
│   └── roles/
│       ├── spec-architect.md          <- Diseña contratos OpenAPI y reglas de negocio
│       ├── dotnet-backend-expert.md    <- Implementa lógica de servidor y persistencia
│       ├── frontend-expert.md          <- Desarrolla interfaz React y consume la API
│       └── qa-guardian.md              <- Audita calidad, pruebas y rendimiento
├── .vscode/
│   ├── launch.json                    <- Perfil F5 para iniciar todo el ecosistema
│   └── tasks.json                     <- Tareas de compilación y ejecución
├── harness/
│   └── ProyectoFullstack.AppHost/     <- 🌟 ORQUESTADOR .NET ASPIRE 9.0
│       ├── Program.cs                 <- Código C# que orquesta SQL, Redis, Back y Front
│       └── launchSettings.json        <- Puertos de Dashboard y OTLP (localhost:18888)
├── src/
│   ├── Backend.ServiceDefaults/       <- Extensiones de resiliencia y OpenTelemetry
│   ├── Backend.Domain/                <- Entidades puras y patrón Result<T>
│   ├── Backend.Application/           <- Casos de uso, interfaces ICacheService, DTOs
│   ├── Backend.Infrastructure/        <- EF Core (SQL Server / SQLite) y Redis Cache
│   └── Backend.Api/                   <- FastEndpoints v8.3, Swagger, Program.cs
├── frontend/                          <- REACT 19 + VITE + TYPESCRIPT
│   ├── package.json
│   ├── vite.config.ts                 <- Proxy dinámico hacia el Backend
│   └── src/
│       ├── api/types.ts               <- Tipos de contratos de datos
│       ├── App.tsx                    <- Dashboard y catálogo reactivo
│       └── main.tsx
├── specs/                             <- Ciclo OpenSpec SDD
│   ├── project.md                     <- Contexto general del sistema
│   └── specs/catalog/spec.md          <- Especificación de contratos del catálogo
├── AGENTS.md                          <- Protocolo maestro multi-agente
├── Directory.Build.props              <- Configuración global MSBuild
├── Directory.Packages.props           <- Central Package Management (CPM)
├── ProyectoFullstack.sln              <- Solución de Visual Studio
└── README.md                          <- Documentación del proyecto
```

---

## 🚀 Puesta en Marcha Rápida

### Prerrequisitos
- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0) o .NET 9 SDK.
- [Node.js (v20 o superior)](https://nodejs.org/) y `npm`.
- [Docker Desktop](https://www.docker.com/) (necesario para que Aspire levante los contenedores de SQL Server y Redis).

---

### Opción 1: Ejecución con 1 solo Clic en Visual Studio Code (F5)
1. Abre esta carpeta en **Visual Studio Code**.
2. Presiona **`F5`** (o ve a la pestaña *Run and Debug* y selecciona **"🚀 Iniciar Ecosistema Completo (.NET Aspire Harness)"**).
3. Automáticamente se abrirá en tu navegador el **Dashboard de .NET Aspire** en:
   👉 `http://localhost:18888`
4. Desde el Dashboard podrás:
   - Ver el estado de los contenedores **SQL Server** y **Redis**.
   - Ver los logs en vivo de la **API Backend** y del **Frontend React**.
   - Hacer clic en el enlace del frontend (`http://localhost:3000`) para ver la aplicación web.

---

### Opción 2: Ejecución desde la Terminal

```powershell
# 1. Navegar a la raíz del monorepo
cd proyecto-fullstack-harness

# 2. Iniciar el Harness de Aspire (levanta SQL + Redis + Back + Front)
dotnet run --project harness/ProyectoFullstack.AppHost

# 3. Acceder al Dashboard:
# http://localhost:18888
```

---

## 🧭 Puntos de Entrada y URLs del Sistema

| Servicio | URL | Descripción |
| :--- | :--- | :--- |
| **Aspire Dashboard** | `http://localhost:18888` | Panel centralizado de monitoreo, trazas, logs y estado |
| **Frontend Web** | `http://localhost:3000` | Aplicación React + Vite con catálogo de productos |
| **Backend Swagger UI** | `http://localhost:5100/swagger` | Documentación interactiva de la API |
| **OpenAPI Contract** | `http://localhost:5100/openapi/v1.json` | Contrato OpenAPI estándar |
| **Health Checks** | `http://localhost:5100/health` | Estado de salud del backend |

---

## 🤖 Cómo Trabajar con Agentes de IA en este Monorepo

Este repositorio está preparado para que varios agentes de IA trabajen en equipo utilizando el comando **/teamwork** o asignando los roles de `.agent/roles/`:

```
1. Tú escribes el requerimiento general (Prompt).
2. El rol 'spec-architect' define el contrato en specs/specs/mi-feature/spec.md.
3. El rol 'dotnet-backend-expert' implementa el endpoint en src/Backend.Api.
4. El rol 'frontend-expert' construye la interfaz en frontend/src/App.tsx.
5. El rol 'qa-guardian' valida la compilación de ambos mundos y la ejecución en el Harness.
```

---

## 🧪 Comandos Útiles para Desarrolladores

```powershell
# Compilar todo el backend y el AppHost
dotnet build

# Compilar el Frontend React
cd frontend
npm run build

# Ejecutar el frontend de manera independiente (si ya tienes la API corriendo)
cd frontend
npm run dev
```

---

## 📄 Licencia
Este proyecto está bajo la licencia MIT. Libre para uso como base de desarrollo empresarial.
