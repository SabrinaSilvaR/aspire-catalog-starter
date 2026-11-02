# Proyecto: Monorepo Fullstack con Harness de Orquestación (.NET Aspire)

## 1. Visión del Sistema
Monorepo empresarial full-stack que provee un entorno de desarrollo local orquestado con **.NET Aspire 9.0**, integrando:
- **Frontend**: Single Page Application con React 19, Vite y TypeScript.
- **Backend API**: Servicios bajo Clean Architecture y Vertical Slice REPR con FastEndpoints y .NET 10.
- **Persistencia**: Microsoft SQL Server 2022 con EF Core.
- **Caché Distribuido**: Redis 7 con fallback suave a memoria.
- **Gobernanza Multi-Agente**: Arquitectura colaborativa de 4 agentes de IA (*Spec Architect, Backend Expert, Frontend Expert, QA Guardian*).

## 2. Tecnologías Principales
| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Orquestador (Harness)** | .NET Aspire 9.0 AppHost | Gestión de contenedores, inyección de conexiones y Dashboard OTLP |
| **Frontend** | React + Vite + TypeScript | UI reactiva de alto rendimiento |
| **Backend API** | FastEndpoints v8.3 + .NET 10 | Endpoints REPR de alto rendimiento |
| **Base de Datos** | SQL Server 2022 + SQLite | Almacenamiento relacional transaccional |
| **Caché** | Redis 7 + DistributedMemoryCache | Aceleración de lecturas y control de estados |

## 3. Convenciones de Comunicación
- Contratos REST OpenAPI expuestos en `/swagger` y `/openapi/v1.json`.
- URLs en kebab-case (`/api/products`).
- Formato de intercambio JSON con camelCase en nombres de propiedades.
- Manejo de errores bajo RFC 7807 (ProblemDetails).
