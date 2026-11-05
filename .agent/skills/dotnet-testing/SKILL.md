---
name: dotnet-testing
description: xUnit testing conventions, FluentAssertions, FastEndpoints.Testing and mock strategies for .NET 9.
---

# Skill: .NET Testing Conventions (xUnit + FluentAssertions)

Guía para estructurar y ejecutar pruebas unitarias y de integración en el monorepo.

## 1. Convenciones de Nombres
- Proyectos de prueba ubicados bajo `tests/` con el sufijo `.Tests` (ej. `tests/Backend.Api.Tests/`).
- Carpetas espejadas según la capa evaluada (`Endpoints/`, `Validators/`, `Services/`).
- Clases de prueba nombradas `<ClaseBajoPrueba>Tests.cs`.
- Métodos nombrados bajo el patrón `Should_ResultadoEsperado_When_Condicion`:
  ```csharp
  [Fact]
  public async Task Should_ReturnValidationError_When_NameIsEmpty()
  { ... }
  ```

## 2. Aserciones Expresivas con FluentAssertions
```csharp
result.IsValid.Should().BeFalse();
result.Errors.Should().Contain(e => e.PropertyName == "Name");
```

## 3. Mocks y Dobles de Prueba
- Utilizar `NSubstitute` o `Moq` para simular dependencias (`ICacheService`, repositorios externos).
- Para pruebas de persistencia en memoria, utilizar `Microsoft.EntityFrameworkCore.InMemory` o SQLite en memoria para tests aislados y rápidos.

## 4. Comandos de Ejecución
```powershell
dotnet test                                                     # toda la suite
dotnet test tests/Backend.Api.Tests                             # proyecto específico
dotnet test --filter "FullyQualifiedName~Product"               # filtro por término
```
