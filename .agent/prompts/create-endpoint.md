# FastEndpoints Endpoint Creation Prompt

Create a new FastEndpoints endpoint for [ENDPOINT_DESCRIPTION] following these requirements:

> **Start from the closest existing endpoint.** Find the feature folder under
> `src/App/Modules/` most similar to what you're building (e.g. `Modules/Expediente/` for a
> CRUD-shaped read, `Modules/CartaCobranza/` for a batch-triggering action) and mirror its shape
> exactly — same DTO location, same error-handling pattern, same `Group<T>()` usage.

## Core Requirements

### 1. Endpoint Structure

- One class per HTTP verb, named `<Verb><Feature>Endpoint`, in
  `Modules/<Feature>/<Verb><Feature>.cs`
- Inherit `Endpoint<TRequest>`, `Endpoint<TRequest, TResponse>`, or `EndpointWithoutRequest[<TResponse>]`
- `Configure()` sets the route verb + path, `Group<<Feature>Controller>()`, and `Summary(s => ...)`
  with the response codes actually returned

### 2. Authorization (decide explicitly)

- **Protected** (default): add `[Authorization]` on the class. Do **not** also call
  `AllowAnonymous()` anywhere in `Configure()` — that combination is contradictory and has no
  effect on the real gate (`JwtAuthPreProcessor` checks only for the attribute).
- **Public** (rare — only if the endpoint is genuinely meant to be callable without a JWT, like
  login): omit `[Authorization]` entirely, and say so explicitly when presenting the change.

### 3. Request/Response DTOs

- Define in `Dto/<Feature>/<Name>.cs`, separate from `Data/Entities/`
- Never expose an EF Core entity directly over the wire

### 4. Business logic delegation

- Inject the feature's service (`I<Name>Service`) via constructor — never inline business logic,
  never touch `DbContext`/a repository directly from the endpoint

### 5. Error handling

- Prefer letting a typed exception (`Data/Exceptions/`) bubble to the global middleware
- If catching locally, map specific exceptions to specific status codes (`KeyNotFoundException`
  → 404, `InvalidOperationException` → 400, etc.) and return a **generic** message for the
  catch-all `Exception` case — never `ex.Message` or a stack trace

### 6. Registration

- If this introduces a new service, register it in `Program.cs`
  (`builder.Services.AddScoped<IXxxService, XxxService>()`)

## Implementation Pattern

```csharp
using App.Authorization;
using App.Dto.<Feature>;
using App.Services;
using FastEndpoints;

namespace App.Endpoints.<Feature>;

[Authorization]
public class <Verb><Feature>Endpoint : Endpoint<<Request>, <Response>>
{
    private readonly I<Feature>Service _service;

    public <Verb><Feature>Endpoint(I<Feature>Service service) => _service = service;

    public override void Configure()
    {
        <Verb>("<route>");
        Group<<Feature>Controller>();
        Summary(s =>
        {
            s.Summary = "<one-line description>";
            s.Responses[200] = "<success case>";
            s.Responses[404] = "<not-found case, if applicable>";
            s.Responses[500] = "Error interno del servidor.";
        });
    }

    public override async Task HandleAsync(<Request> req, CancellationToken ct)
    {
        try
        {
            var result = await _service.<Method>Async(req./* ... */);
            if (result == null)
            {
                await SendNotFoundAsync(ct);
                return;
            }
            await SendAsync(result, 200, ct);
        }
        catch (KeyNotFoundException e)
        {
            await SendAsync(new { Error = e.Message }, 404, ct);
        }
        catch (Exception)
        {
            await SendAsync(new { Error = "Error interno del servidor." }, 500, ct);
        }
    }
}
```

## Technical Checklist

- [ ] Authorization decision made explicitly (protected xor public, never both signals at once)
- [ ] Route registered under the correct `Group<T>()`
- [ ] `Summary()` documents every status code actually returned
- [ ] Request/response are DTOs, not raw entities
- [ ] Business logic lives in the injected service, not in `HandleAsync`
- [ ] No exception detail (`ex.Message`, stack trace) reaches the client from a generic `catch`
- [ ] New service (if any) registered in `Program.cs`
- [ ] `CancellationToken` threaded through every awaited call
- [ ] xUnit test added (see `create-test.md`) — happy path, not-found/error, authorization if
      relevant

Generate the endpoint following these patterns and ensure it integrates seamlessly with the
existing FastEndpoints architecture. See the `fastendpoints-conventions` skill for more detail.
