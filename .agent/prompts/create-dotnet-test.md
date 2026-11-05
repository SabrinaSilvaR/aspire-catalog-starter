# xUnit Test Creation Prompt

Create comprehensive xUnit tests for [ENDPOINT/SERVICE_NAME] following this repo's testing
conventions:

> **Start from the closest existing test.** For an endpoint, mirror a file under
> `src/Tests/ControllerTests/<Feature>/`; for a service, mirror one under
> `src/Tests/ServicesTests/<Feature>/`.

## Core Requirements

### 1. Framework

- xUnit + Moq. Data-layer tests additionally use `Moq.EntityFrameworkCore` (mocked `DbSet<T>`)
  or the EF Core InMemory provider — pick whichever the existing tests for that feature already
  use, don't mix both styles in one test class.

### 2. Endpoint tests (`Tests/ControllerTests/<Feature>/<Verb><Feature>Endpoint.test.cs`)

- Instantiate the endpoint with `Factory.Create<T>(c => { c.AddTestServices(s => s.AddSingleton(mock.Object)); })`
  — this bypasses `Configure()`/the HTTP pipeline entirely and calls `HandleAsync` directly
- Mock the service interface the endpoint depends on
- Assert on `_endpoint.HttpContext.Response.StatusCode` and the sent payload where relevant
- Cover: happy path, not-found (404), the specific business-error mappings the endpoint declares
  (400/424/etc.), and the generic 500 fallback

### 3. Service tests (`Tests/ServicesTests/<Feature>/<Name>ServiceTests.cs`)

- Mock the repository interface with Moq (or use EF Core InMemory if the feature's existing
  tests do)
- Assert on the service's observable behavior: return values, thrown exceptions — not on
  incidental internal calls, unless the call itself is the contract (e.g. "must call
  `SaveChangesAsync` exactly once")
- Cover: happy path, not-found/`null` repository result, and at least one business-rule edge case

### 4. Shared fixtures

- Reuse builders/fixtures from `Tests/TestData/` instead of duplicating object construction
  across test classes

## Implementation Patterns

### Endpoint test

```csharp
using App.Dto.<Feature>;
using App.Endpoints.<Feature>;
using App.Services;
using FastEndpoints;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Xunit;

namespace Modules.<Feature>.Tests;

public class <Verb><Feature>EndpointTests
{
    private readonly Mock<I<Feature>Service> _mockService = new();
    private readonly <Verb><Feature>Endpoint _endpoint;

    public <Verb><Feature>EndpointTests()
    {
        _endpoint = Factory.Create<<Verb><Feature>Endpoint>(c =>
        {
            c.AddTestServices(s => s.AddSingleton(_mockService.Object));
        });
    }

    [Fact]
    public async Task HandleAsync_Success_Returns200()
    {
        _mockService.Setup(s => s.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync(new <Response>Dto { /* ... */ });

        await _endpoint.HandleAsync(new <Request> { /* ... */ }, default);

        Assert.Equal(200, _endpoint.HttpContext.Response.StatusCode);
    }

    [Fact]
    public async Task HandleAsync_NotFound_Returns404()
    {
        _mockService.Setup(s => s.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync((<Response>Dto?)null);

        await _endpoint.HandleAsync(new <Request> { /* ... */ }, default);

        Assert.Equal(404, _endpoint.HttpContext.Response.StatusCode);
    }
}
```

### Service test

```csharp
using App.Data;
using App.Services;
using Moq;
using Xunit;

namespace Services.<Feature>.Tests;

public class <Name>ServiceTests
{
    private readonly Mock<I<Feature>Repository> _mockRepository = new();
    private readonly <Name>Service _service;

    public <Name>ServiceTests()
    {
        _service = new <Name>Service(_mockRepository.Object);
    }

    [Fact]
    public async Task GetByIdAsync_Found_ReturnsMappedDto()
    {
        _mockRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(new <Entity> { Id = 1 });

        var result = await _service.GetByIdAsync(1);

        Assert.NotNull(result);
    }

    [Fact]
    public async Task GetByIdAsync_NotFound_ReturnsNull()
    {
        _mockRepository.Setup(r => r.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((<Entity>?)null);

        var result = await _service.GetByIdAsync(99);

        Assert.Null(result);
    }

    [Fact]
    public async Task CreateAsync_SaveFails_ThrowsInvalidOperationException()
    {
        _mockRepository.Setup(r => r.SaveChangesAsync()).ReturnsAsync(false);

        await Assert.ThrowsAsync<InvalidOperationException>(
            () => _service.CreateAsync(new <Request>())
        );
    }
}
```

## Technical Checklist

- [ ] Endpoint tests call `HandleAsync` directly via `Factory.Create<T>`, mocking only the
      service dependency
- [ ] Service tests mock only the repository dependency
- [ ] Happy path, not-found/`null`, and at least one error/edge case covered per method
- [ ] Authorization behavior tested where the endpoint's `[Authorization]` decision is
      non-obvious or was recently changed
- [ ] No test depends on a real SQL Server connection (use Moq/InMemory)
- [ ] Shared fixtures reused from `Tests/TestData/` instead of duplicated

Run with `pnpm test:dev` (full suite + coverage) or
`dotnet test src/Tests --filter "FullyQualifiedName~<Feature>"` (focused). See the
`dotnet-testing` skill for the full conventions.
