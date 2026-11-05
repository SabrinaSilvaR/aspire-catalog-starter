---
name: csharp-conventions
description: C# 13 and .NET 9 coding standards, nullable references, async/await with cancellation tokens, and exception patterns.
---

# Skill: C# & .NET 9 Coding Conventions

Estándares de codificación obligatorios para proyectos en `src/` y `tests/`.

## 1. Nulabilidad y Tipado Estricto
- `<Nullable>enable</Nullable>` está activo en toda la solución.
- Respetar las advertencias de compilación; no usar `!` para silenciar avisos salvo que la invariante esté matemáticamente demostrada.
- Preferir tipos explícitos en APIs públicas e inferencia (`var`) para variables locales cuando el tipo sea evidente en la asignación.

## 2. Asincronismo y Cancelación
- Todo método asíncrono debe llevar el sufijo `Async` y recibir un `CancellationToken cancellationToken = default`.
- Nunca bloquear con `.Wait()`, `.Result` o `.GetAwaiter().GetResult()`.
- Usar `ValueTask` o `Task` según corresponda.

## 3. Inyección de Dependencias
- Preferir Primary Constructors (C# 12+) para inyección por constructor limpia:
  ```csharp
  public class ProductService(IApplicationDbContext dbContext, ILogger<ProductService> logger) : IProductService
  {
      // dbContext y logger están disponibles directamente en el cuerpo de la clase
  }
  ```
- Registrar servicios con tiempo de vida `Scoped` por defecto en la capa de Dependency Injection.

## 4. Manejo de Excepciones
- Usar excepciones tipadas de dominio (`NotFoundException`, `ValidationException`, `ConflictException`).
- No atrapar excepciones genéricas `catch (Exception)` para silenciarlas. Dejar que el middleware RFC 7807 genere la respuesta `ProblemDetails`.
