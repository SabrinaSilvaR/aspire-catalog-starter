# Service Creation Prompt

Create a new service for [SERVICE_DESCRIPTION] following these requirements:

> **Start from the closest existing service.** `Services/Expedientes/ExpedienteService.cs` and
> `Services/Concurrencia/ConcurrenciaService.cs` are good references for CRUD-shaped and
> calculation-shaped services respectively.

## Core Requirements

### 1. Structure

- `Services/<Feature>/<Name>Service.cs` implementing `I<Name>Service` (in the same folder)
- Constructor-inject the repository interface (`I<Feature>Repository`) — never the raw
  `DbContext`, never another service's repository directly
- Public methods are `async Task<T>`/`async Task`, named `<Verb><Noun>Async`

### 2. Responsibilities

- **Only** business logic and orchestration: validate preconditions, call the repository,
  map between entities and DTOs (via Mapster's `Adapt<T>` where the feature already uses it, or
  explicit mapping otherwise), throw typed exceptions for domain-level failures
- **Not** responsible for: HTTP status codes, request/response shaping (that's the endpoint), or
  raw SQL/LINQ against `DbContext` (that's the repository)

### 3. Error handling

- Throw exceptions the endpoint layer already knows how to translate: `KeyNotFoundException` for
  "not found", `InvalidOperationException` for a business-rule violation, or a custom type under
  `Data/Exceptions/` for anything more specific
- Never swallow an exception silently; never return `null` to signal an error unless that's the
  established convention for that method (check sibling methods in the same service)

### 4. Registration

- Register in `Program.cs` under `#region Dependency Injection`:
  `builder.Services.AddScoped<I<Name>Service, <Name>Service>();`

## Implementation Pattern

```csharp
using App.Data;
using App.Data.Entities;
using App.Dto.<Feature>;
using Mapster;

namespace App.Services;

public class <Name>Service : I<Name>Service
{
    private readonly I<Feature>Repository _repository;

    public <Name>Service(I<Feature>Repository repository) => _repository = repository;

    public async Task<<Response>Dto?> GetByIdAsync(int id)
    {
        var entity = await _repository.GetByIdAsync(id);
        return entity?.Adapt<<Response>Dto>();
    }

    public async Task<<Response>Dto> CreateAsync(<Request> req)
    {
        var existing = await _repository.GetByIdAsync(req.Id);
        if (existing == null)
        {
            throw new KeyNotFoundException("<Entity> no encontrado.");
        }

        var entity = req.Adapt<<Entity>>();
        _repository.Add(entity);

        if (!await _repository.SaveChangesAsync())
        {
            throw new InvalidOperationException("Error al guardar <entity>.");
        }

        return entity.Adapt<<Response>Dto>();
    }
}
```

## Technical Checklist

- [ ] Interface (`I<Name>Service`) defined alongside the implementation
- [ ] Constructor injects the repository interface, not `DbContext`
- [ ] No HTTP concerns (status codes, `SendAsync`) inside the service
- [ ] Typed exceptions used for not-found / business-rule failures
- [ ] Registered in `Program.cs` (`AddScoped`)
- [ ] xUnit tests mock the repository with Moq (or `Moq.EntityFrameworkCore`/EF Core InMemory)
      and cover happy path + not-found + at least one business-rule edge case

See the `ef-core-data` and `dotnet-testing` skills for the data-layer and testing conventions
this service should follow.
