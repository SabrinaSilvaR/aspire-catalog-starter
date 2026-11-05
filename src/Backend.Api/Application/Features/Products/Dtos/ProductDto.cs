namespace Backend.Application.Features.Products.Dtos;

public record ProductDto(
    Guid Id,
    string Name,
    string Sku,
    string Description,
    decimal Price,
    int StockQuantity,
    bool IsActive,
    DateTime CreatedAtUtc
);
