using Backend.Application.Common.Interfaces;
using Backend.Application.Features.Products.Dtos;
using FastEndpoints;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Backend.Api.Endpoints.Products;

public record ListProductsResponse(IReadOnlyList<ProductDto> Items, int TotalCount, bool FromCache);

public class ListProductsEndpoint(IApplicationDbContext dbContext, ICacheService cache) 
    : EndpointWithoutRequest<ListProductsResponse>
{
    public override void Configure()
    {
        Get("/api/products");
        AllowAnonymous();
        Description(b => b
            .Produces<ListProductsResponse>(200, "application/json")
            .WithTags("Products")
            .WithSummary("Lista todos los productos del catálogo con soporte de caché"));
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        const string cacheKey = "products:list:all";
        var cached = await cache.GetAsync<IReadOnlyList<ProductDto>>(cacheKey, ct);

        if (cached is not null)
        {
            await Send.OkAsync(new ListProductsResponse(cached, cached.Count, true), ct);
            return;
        }

        var products = await dbContext.Products
            .AsNoTracking()
            .OrderByDescending(p => p.CreatedAtUtc)
            .Select(p => new ProductDto(
                p.Id,
                p.Name,
                p.Sku,
                p.Description,
                p.Price,
                p.StockQuantity,
                p.IsActive,
                p.CreatedAtUtc))
            .ToListAsync(ct);

        await cache.SetAsync(cacheKey, products, TimeSpan.FromMinutes(5), ct);
        await Send.OkAsync(new ListProductsResponse(products, products.Count, false), ct);
    }
}
