---
name: dotnet-fastendpoints-feature
description: Generates vertical slice REPR endpoints in .NET 10 using FastEndpoints, FluentValidation, EF Core, and Redis caching.
---

# Skill: .NET FastEndpoints Feature Generator

Esta habilidad rige la creación de endpoints bajo el patrón **REPR** (Request-Endpoint-Response) en `src/Backend.Api`.

## 1. Convenciones Obligatorias
- Cada caso de uso vive en un archivo único o carpeta de feature cohesiva: `src/Backend.Api/Endpoints/{Feature}/{Action}Endpoint.cs`.
- Las respuestas exitosas se envían con `Send.OkAsync(...)` o `Send.CreatedAtAsync(...)`.
- Si el endpoint realiza lecturas frecuentes, inyectar `ICacheService` y verificar primero en Redis (`GetAsync<T>`).
- Si el endpoint realiza escrituras (`POST`, `PUT`, `DELETE`), invalidar la clave de caché correspondiente con `cache.RemoveAsync(...)`.

## 2. Plantilla Base
Consulta [`templates/EndpointSlice.cs.template`](./templates/EndpointSlice.cs.template).

## 3. Ejemplo de Referencia
Consulta [`examples/CreateSupplierEndpointExample.cs.txt`](./examples/CreateSupplierEndpointExample.cs.txt).
