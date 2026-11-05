# EF Core Entity + Repository Creation Prompt

Create a new EF Core entity and its repository for [ENTITY_DESCRIPTION] following these
requirements:

> **Start from the closest existing entity.** `Data/Entities/Expediente.cs` +
> `Data/ExpedienteRepository.cs` + `Data/IExpedienteRepository.cs` are the canonical example of
> this repo's entity/repository shape.

## Core Requirements

### 1. Entity (`Data/Entities/<Name>.cs`)

- Plain POCO, free of business logic — properties only, plus navigation properties for
  relationships (e.g. `public Expediente Expediente { get; set; }`)
- Nullable reference types respected: a required relationship is non-nullable, an optional one
  is `?`
- Register the `DbSet<T>` on `ExpedienteContext` if this is a new top-level entity

### 2. Repository (`Data/<Feature>Repository.cs` + `Data/I<Feature>Repository.cs`)

- One repository per feature/aggregate, not one per entity if entities are always accessed
  together (e.g. `Adherencia` is accessed through `IExpedienteRepository`, not its own repo)
- Methods return entities or primitives — **not** DTOs (mapping to DTOs is the service's job)
- Wrap domain-level failures in a typed exception from `Data/Exceptions/` instead of letting
  `DbUpdateException`/`SqlException` surface raw
- `SaveChangesAsync()` returns `bool` (existing convention: `true` on success) — callers
  (services) check it and throw `InvalidOperationException` on `false`

### 3. Migration

- Add an EF Core migration scoped to exactly this change: `dotnet ef migrations add <Name> -p src/App`
- Never hand-edit a previously shipped migration
- Call out the migration explicitly when presenting the change — it affects a shared database

## Implementation Pattern

```csharp
// Data/Entities/<Name>.cs
namespace App.Data.Entities;

public class <Name>
{
    public int <Name>Id { get; set; }
    public int ExpedienteId { get; set; }
    public Expediente Expediente { get; set; } = null!;
    // ... other properties
}
```

```csharp
// Data/I<Feature>Repository.cs (extend the existing interface, don't create a new one
// if the feature already has a repository)
public interface I<Feature>Repository
{
    Task<<Name>?> Get<Name>ByIdAsync(int id);
    void Add<Name>(<Name> entity);
    Task<bool> SaveChangesAsync();
}
```

```csharp
// Data/<Feature>Repository.cs
public class <Feature>Repository : I<Feature>Repository
{
    private readonly ExpedienteContext _context;

    public <Feature>Repository(ExpedienteContext context) => _context = context;

    public async Task<<Name>?> Get<Name>ByIdAsync(int id) =>
        await _context.<Name>s.FirstOrDefaultAsync(x => x.<Name>Id == id);

    public void Add<Name>(<Name> entity) => _context.<Name>s.Add(entity);

    public async Task<bool> SaveChangesAsync() => await _context.SaveChangesAsync() > 0;
}
```

## Technical Checklist

- [ ] Entity is a POCO with no business logic
- [ ] Nullable reference types correctly reflect required vs. optional relationships
- [ ] Repository method returns entities/primitives, not DTOs
- [ ] Domain-level failures throw a typed exception, not a raw EF/SQL exception
- [ ] Migration added and scoped to this change only (`dotnet ef migrations add <Name>`)
- [ ] Tests use Moq + `Moq.EntityFrameworkCore` or EF Core InMemory (match the existing style for
      that feature — don't mix both in the same test class)

See the `ef-core-data` skill for the full data-layer conventions.
