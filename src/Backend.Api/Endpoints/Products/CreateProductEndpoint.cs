using Backend.Application.Common.Interfaces;
using Backend.Application.Features.Products.Dtos;
using Backend.Domain.Entities;
using FastEndpoints;
using FluentValidation;
using Microsoft.AspNetCore.Http;

namespace Backend.Api.Endpoints.Products;

public record CreateProductRequest(string Name, string Sku, string Description, decimal Price, int StockQuantity);

public class CreateProductValidator : Validator<CreateProductRequest>
{
    public CreateProductValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Sku).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Price).GreaterThanOrEqualTo(0);
        RuleFor(x => x.StockQuantity).GreaterThanOrEqualTo(0);
    }
}

public class CreateProductEndpoint(IApplicationDbContext dbContext, ICacheService cache) 
    : Endpoint<CreateProductRequest, ProductDto>
{
    public override void Configure()
    {
        Post("/api/products");
        AllowAnonymous();
        Description(b => b
            .Produces<ProductDto>(201, "application/json")
            .ProducesProblemFE(400)
            .WithTags("Products")
            .WithSummary("Crea un nuevo producto e invalida el caché de listado"));
    }

    public override async Task HandleAsync(CreateProductRequest req, CancellationToken ct)
    {
        var result = Product.Create(req.Name, req.Sku, req.Description, req.Price, req.StockQuantity);

        if (result.IsFailure)
        {
            AddError(result.Error!);
            await Send.ErrorsAsync(400, ct);
            return;
        }

        var product = result.Value;
        dbContext.Products.Add(product);
        await dbContext.SaveChangesAsync(ct);

        // Invalidar caché
        await cache.RemoveAsync("products:list:all", ct);

        var dto = new ProductDto(
            product.Id,
            product.Name,
            product.Sku,
            product.Description,
            product.Price,
            product.StockQuantity,
            product.IsActive,
            product.CreatedAtUtc
        );

        await Send.CreatedAtAsync<ListProductsEndpoint>(null, dto, cancellation: ct);
    }
}
