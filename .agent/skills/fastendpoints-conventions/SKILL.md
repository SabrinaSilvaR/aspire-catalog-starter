---
name: fastendpoints-conventions
description: Vertical slice REPR endpoints in .NET 9 using FastEndpoints, FluentValidation, route groups, and OpenAPI summaries.
---

# Skill: FastEndpoints REPR Conventions

Guía para diseñar e implementar endpoints bajo el patrón **REPR** (Request-Endpoint-Response) con FastEndpoints en `src/Backend.Api/Endpoints/`.

## 1. Estructura de un Endpoint REPR
Cada funcionalidad vertical se organiza en su propia carpeta por entidad o módulo (ej. `Endpoints/Products/`):

- **Request**: `public record CreateProductRequest(...)`
- **Validator**: `public class CreateProductValidator : Validator<CreateProductRequest>`
- **Endpoint**: `public class CreateProductEndpoint : Endpoint<CreateProductRequest, ProductDto>`

## 2. Configuración Canónica (`Configure()`)
```csharp
public override void Configure()
{
    Post("/api/products");
    AllowAnonymous(); // o requerir autorización según contrato
    Description(b => b
        .Produces<ProductDto>(StatusCodes.Status201Created, "application/json")
        .ProducesProblemFE(StatusCodes.Status400BadRequest)
        .ProducesProblemFE(StatusCodes.Status500InternalServerError)
        .WithTags("Products")
        .WithSummary("Crea un nuevo producto e invalida el caché"));
}
```

## 3. Manejo de la Solicitud (`HandleAsync`)
- Recibe `req` y `CancellationToken ct`.
- Llama a la lógica de dominio o servicio inyectado.
- Retorna el DTO de respuesta utilizando los métodos tipados de FastEndpoints:
  - `await Send.CreatedAtAsync<GetProductEndpoint>(new { id = result.Id }, dto, cancellation: ct);`
  - `await Send.OkAsync(dto, ct);`
  - `await Send.NotFoundAsync(ct);`
  - `await Send.ErrorsAsync(400, ct);`

## 4. Reglas Críticas
1. **Un solo verbo HTTP por clase**: Si una entidad tiene operaciones CRUD, cada una es una clase de endpoint separada (`CreateProductEndpoint.cs`, `GetProductEndpoint.cs`, `ListProductsEndpoint.cs`).
2. **Propagación de `ct`**: Todo método asíncrono invocado dentro de `HandleAsync` debe recibir `ct`.
3. **No exponer entidades**: Mapear siempre a DTOs de salida.
