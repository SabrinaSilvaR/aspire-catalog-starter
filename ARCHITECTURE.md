# 🗺️ Arquitectura del Repositorio

> Guía de "¿dónde va cada cosa?". Para el protocolo de colaboración entre agentes ver [`AGENTS.md`](./AGENTS.md); para instalar y correr el proyecto ver [`README.md`](./README.md).

Cada sección describe una carpeta: para qué sirve, qué tipo de archivo va ahí, y un ejemplo real que ya existe en el repo — así, antes de crear un archivo nuevo, sabés en qué carpeta va y qué forma debería tener.

---

## 1. Backend — `src/Backend.Api/`

Es **un solo proyecto `.csproj`**, organizado por carpetas que imitan las capas de Clean Architecture. No hay 4 proyectos separados (`Domain`, `Application`, `Infrastructure`, `Api`) como en un setup clásico — los namespaces (`Backend.Domain.*`, `Backend.Application.*`, `Backend.Infrastructure.*`) se mantuvieron igual, pero físicamente todo compila junto. El límite entre capas es de **disciplina y convención**, no del compilador: nada impide que un endpoint llame directo a EF Core, pero la convención dice que no lo hagas.

### `Domain/Entities/`
Entidades puras del negocio. **Sin** `using` a EF Core, FastEndpoints, ni nada de infraestructura.
- Constructor **privado** + método de fábrica estático `Create(...)` que valida invariantes y devuelve `Result<T>` (nunca lanza excepción por un error de validación de negocio).
- Ejemplo real: [`Product.cs`](./src/Backend.Api/Domain/Entities/Product.cs) — `Product.Create(name, sku, description, price, stock)` valida que el nombre y el SKU no estén vacíos y que precio/stock no sean negativos.

### `Domain/Common/`
Tipos compartidos del dominio, sin dependencias externas.
- Ejemplo real: [`Result.cs`](./src/Backend.Api/Domain/Common/Result.cs) — el patrón `Result<T>.Success(value)` / `Result<T>.Failure(error)` que usan los `Create(...)` de las entidades.

### `Application/Common/Interfaces/`
Contratos (`interface`) que `Infrastructure` implementa más abajo. El dominio y los endpoints dependen de **estas interfaces**, nunca de la implementación concreta.
- `IApplicationDbContext` — lo que un endpoint necesita de la base de datos, sin saber si es SQL Server o SQLite.
- `ICacheService` — `GetAsync<T>`/`SetAsync<T>`/`RemoveAsync`, sin saber si hay Redis detrás o memoria.

### `Application/Features/{Feature}/Dtos/`
DTOs de transporte, **separados** de las entidades de dominio (nunca se devuelve una entidad directo en una respuesta HTTP).
- Ejemplo real: [`ProductDto.cs`](./src/Backend.Api/Application/Features/Products/Dtos/ProductDto.cs).

### `Infrastructure/Persistence/`
- `ApplicationDbContext.cs` — el `DbContext` de EF Core, con `OnModelCreating` configurando índices únicos, longitudes máximas y precisión decimal.
- `ApplicationDbContextFactory.cs` — **solo** la usan las herramientas de diseño (`dotnet ef migrations add ...`). Nunca se instancia en tiempo de ejecución; la app real construye el `DbContext` vía inyección de dependencias con la cadena de conexión real.
- `Migrations/` — generadas por `dotnet ef`. No se editan a mano; para cambiar el esquema se agrega una migración nueva.

### `Infrastructure/Services/`
Implementaciones concretas de las interfaces de `Application`.
- Ejemplo real: `CacheService.cs` implementa `ICacheService` sobre `IDistributedCache` (que puede ser Redis real o memoria, según configuración).

### `Infrastructure/DependencyInjection.cs`
Un solo lugar (`AddInfrastructure(services, configuration)`) que registra todo lo de esta capa:
- `DbContext` con **doble proveedor**: SQL Server si hay cadena de conexión con `Server=`, si no cae a SQLite local (`app.db`).
- Caché con **fallback suave**: Redis si hay cadena de conexión, si no `AddDistributedMemoryCache()`.
- `InitializeDatabaseAsync()` — se llama una vez al arrancar: hace `MigrateAsync()` si el proveedor es SQL Server (historial de migraciones versionado), o `EnsureCreatedAsync()` si es SQLite (no tiene sentido versionar un archivo local descartable).

### `Endpoints/{Feature}/`
Patrón **FastEndpoints REPR** (Request-Endpoint-Response): un archivo por operación, con tres piezas juntas.
- Un `record` para el `Request`.
- Un `Validator` (hereda de `Validator<TRequest>`, reglas con FluentValidation: `RuleFor(...).NotEmpty()`, etc.).
- La clase `Endpoint<TRequest, TResponse>` (o `EndpointWithoutRequest<TResponse>`), con `Configure()` (ruta, auth, metadata OpenAPI) y `HandleAsync()` (la lógica).
- Ejemplos reales: [`CreateProductEndpoint.cs`](./src/Backend.Api/Endpoints/Products/CreateProductEndpoint.cs), [`ListProductsEndpoint.cs`](./src/Backend.Api/Endpoints/Products/ListProductsEndpoint.cs).
- Regla: el `HandleAsync` orquesta (llama al dominio, guarda, invalida caché, devuelve respuesta) — no debería tener lógica de negocio compleja inline; eso vive en el método `Create`/los métodos de la entidad.

### `ErrorHandling/GlobalExceptionHandler.cs`
El único punto que atrapa **excepciones no controladas** (`IExceptionHandler`). Loguea el detalle completo (incluyendo stack trace) por Serilog, pero al cliente le devuelve siempre un `ProblemDetails` genérico (RFC 7807) — nunca `ex.Message` ni el stack trace. Se registra en `Program.cs` con `AddExceptionHandler<GlobalExceptionHandler>()` + `app.UseExceptionHandler()`.

### `Program.cs`
Orden de wiring (importa seguir este orden si se agrega algo nuevo):
1. `builder.AddServiceDefaults()` — ver sección 2.
2. Serilog.
3. `AddInfrastructure(...)` — DbContext + caché.
4. `AddExceptionHandler<GlobalExceptionHandler>()` + `AddProblemDetails()`.
5. CORS, FastEndpoints, Swagger.
6. `app.MapDefaultEndpoints()` (`/health`, `/alive`).
7. `app.UseExceptionHandler()`.
8. `await app.Services.InitializeDatabaseAsync()`.
9. `UseCors` → `UseFastEndpoints` → `UseSwaggerGen`.

---

## 2. `src/Backend.ServiceDefaults/`

Sigue siendo un proyecto **separado** (a diferencia de `Domain`/`Application`/`Infrastructure`, que sí se consolidaron en `Backend.Api`). Resuelve telemetría (OpenTelemetry), health checks por defecto (`/health`, `/alive`), *service discovery* y un *resilience handler* para `HttpClient` — todo vía `AddServiceDefaults()` + `MapDefaultEndpoints()`.

¿Por qué separado si hoy solo lo usa `Backend.Api`? Es el patrón estándar de las plantillas de .NET Aspire: está pensado como **punto de extensión** para cuando el `AppHost` orqueste más de un servicio (otro API, un worker, etc.) — en ese momento, todos podrían referenciar este mismo proyecto sin duplicar código. Hoy, con un solo servicio, ese beneficio todavía no se usa, pero el costo de mantenerlo aparte es bajo (es un archivo, `Extensions.cs`).

---

## 3. `harness/ProyectoFullstack.AppHost/Program.cs`

El orquestador de .NET Aspire. Declara los recursos y cómo se conectan entre sí:
```csharp
var sql = builder.AddSqlServer("sqlserver").AddDatabase("CatalogDb");
var redis = builder.AddRedis("redis");
var backend = builder.AddProject<Projects.Backend_Api>("backend-api")
                     .WithReference(sql)
                     .WithReference(redis);
var frontend = builder.AddNpmApp("frontend", "../../frontend", "dev")
                      .WithReference(backend)
                      .WithHttpEndpoint(port: 3000, targetPort: 5173, name: "http");
```
Para agregar un recurso nuevo (otra base de datos, una cola, otro servicio): `.AddX(...)` y enlazarlo con `.WithReference(...)` al proyecto que lo consume. Aspire inyecta automáticamente las cadenas de conexión/URLs — nunca se hardcodean IPs ni puertos de contenedores internos.

---

## 4. Frontend — `frontend/src/`

### `app/components/{atoms,molecules,organisms,layouts,pages}`
Jerarquía de **Atomic Design**, de abajo hacia arriba:
- `atoms/` — piezas mínimas sin lógica de negocio (`Button`, `Input`).
- `organisms/` — componen varios atoms/molecules y sí tienen lógica/estado de una feature completa. Ejemplo real: [`ProductCatalog.tsx`](./frontend/src/app/components/organisms/ProductCatalog/ProductCatalog.tsx) (lista + formulario + manejo de estado del catálogo).
- `layouts/`/`pages/` — todavía no existen en este repo (el proyecto es chico); cuando se necesiten, van en este mismo nivel.
- Regla: la inyección de dependencias (IoC) y el estado global solo se leen a nivel `organism`/`page` hacia abajo, no en los `atoms`.

### `app/schemas/*.schema.ts`
**Un esquema Zod por contrato** de API. El tipo de TypeScript se infiere del esquema (`z.infer<typeof Schema>`) — nunca se escribe una interfaz de TS a mano para un contrato que viene del backend.
- Ejemplo real: [`product.schema.ts`](./frontend/src/app/schemas/product.schema.ts) (`ProductSchema`, `ListProductsResponseSchema`, `CreateProductInputSchema`).

### `app/services/*.service.ts`
Llaman al backend con `fetch` y **parsean la respuesta con el schema de Zod** (`Schema.parse(data)`) antes de devolverla — si el backend cambia el contrato sin avisar, esto falla ruidosamente en vez de dejar pasar datos corruptos.
- Ejemplo real: [`product.service.ts`](./frontend/src/app/services/product.service.ts).

### `app/app.ioc.ts`
Dónde se registran los *bindings* del contenedor de IoC (`container.bind(Clase, new Clase())`) que después se leen con `useInjection(Clase)` en cualquier componente.

### `libs/ioc/`
El micro-contenedor de inyección de dependencias en sí (no es específico de ninguna feature). `createContainer()` devuelve `{ container, useInjection, InversionOfControlProvider }`. Ver su propio [`README.md`](./frontend/src/libs/ioc/README.md) para la API completa — lo importante: permite pisar cualquier binding en tests pasando un `Map` de mocks al `InversionOfControlProvider`.

### `libs/feature/`
Librería de *feature flags* reactivos (`FeatureHandler`, `useFeature`, `withFeatures`, flags controlables desde `localStorage`/`sessionStorage`). Ver su propio [`README.md`](./frontend/src/libs/feature/README.md). Hoy no está en uso activo en `App.tsx`, pero está disponible para cuando se necesite togglear una feature sin desplegar.

---

## 5. `tests/Backend.Api.Tests/`

Convención de carpetas:
- `Domain/` — tests de entidades (ej. `ProductEntityTests.cs`: casos de `Product.Create` válidos e inválidos).
- `Validators/` — tests de los `Validator<T>` de FluentValidation (ej. `CreateProductValidatorTests.cs`).

Stack: xUnit v3 + FluentAssertions + NSubstitute (mocks) + `FastEndpoints.Testing` (para tests de endpoints más adelante).

---

## 6. `.agent/` — Roles y Skills

Gobierna cómo colaboran los agentes de IA en este repo (protocolo completo en [`AGENTS.md`](./AGENTS.md)). Dos tipos de archivo:

**Roles** (`.agent/roles/*.md`) — "quién hace qué":

| Rol | Propósito |
|---|---|
| `spec-architect` | Define contratos y especificaciones **antes** de que se escriba código — única fuente de verdad funcional. |
| `dotnet-backend-expert` | Implementa el backend (`src/`): Clean Architecture, REPR con FastEndpoints, EF Core, Redis. |
| `frontend-expert` | Implementa el frontend (`frontend/`): IoC, Atomic Design, Zod end-to-end. |
| `qa-guardian` | Audita calidad, arquitectura, pruebas y SLAs antes de liberar un cambio. |
| `debug-expert` | Protocolo de 4 fases para aislar y resolver defectos en cualquier parte del monorepo. |

**Skills** (`.agent/skills/*/SKILL.md`) — "cómo se hace una tarea concreta":

| Skill | Gobierna |
|---|---|
| `aspire-harness-orchestrator` | Configurar/extender el AppHost de Aspire. |
| `dotnet-fastendpoints-feature` | Generar un endpoint REPR nuevo (FastEndpoints + FluentValidation + EF Core + Redis). |
| `fastendpoints-conventions` | Convenciones generales de endpoints REPR, route groups, resúmenes OpenAPI. |
| `efcore-entity-manager` | Modelado de entidades, configuraciones EF Core, índices, migraciones. |
| `csharp-conventions` | Estándares de C#: nullable refs, async/await con `CancellationToken`, excepciones. |
| `dotnet-testing` | Convenciones de xUnit, FluentAssertions, mocks. |
| `atomic-design` | Jerarquía de componentes React (ver sección 4). |
| `ioc-binding` | Convenciones del contenedor IoC del frontend. |
| `zod-schema` | Un schema Zod por contrato, inferencia de tipos. |
| `react-component-generator` | Generar un componente React 19 nuevo con Props tipadas. |
| `react-patterns` | Composición sobre herencia, hooks, accesibilidad. |
| `openapi-client-generator` | Generar/sincronizar tipos TS desde el OpenAPI del backend. |
| `vitest-tdd` | TDD con Vitest + React Testing Library. |
| `ways-of-working` | Manual de decisiones por defecto + Definition of Done. |
| `systematic-debugging` | Protocolo de 4 fases para depurar (la base del rol `debug-expert`). |

> Nota: `dotnet-fastendpoints-feature` y `fastendpoints-conventions` se superponen bastante (ambas hablan de endpoints REPR); si los vas a tocar, revisá las dos para no dejarlas contradictorias.

---

## 7. `specs/`

Acá escribe `spec-architect`, **antes** de que el backend o el frontend empiecen a implementar (contract-first). `specs/project.md` es la visión general del sistema; `specs/specs/<feature>/spec.md` es el contrato detallado de una feature puntual (ver `specs/specs/catalog/spec.md` como ejemplo del catálogo de productos).

---

## 8. Cómo correr y verificar todo

No se repite acá — ver [`README.md`](./README.md) para instalación y `scripts/dev.ps1`/`scripts/dev.sh` para levantar el harness completo, y [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) para lo que valida cada PR (`dotnet build/test` + `npm run build/test:run/lint`).
