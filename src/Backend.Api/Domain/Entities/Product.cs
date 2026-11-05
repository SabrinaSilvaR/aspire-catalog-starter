using Backend.Domain.Common;

namespace Backend.Domain.Entities;

public class Product
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string Sku { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public decimal Price { get; private set; }
    public int StockQuantity { get; private set; }
    public bool IsActive { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }
    public DateTime? UpdatedAtUtc { get; private set; }

    private Product() { }

    public static Result<Product> Create(string name, string sku, string description, decimal price, int stockQuantity)
    {
        if (string.IsNullOrWhiteSpace(name))
            return Result<Product>.Failure("El nombre del producto no puede estar vacío.");

        if (string.IsNullOrWhiteSpace(sku))
            return Result<Product>.Failure("El SKU no puede estar vacío.");

        if (price < 0)
            return Result<Product>.Failure("El precio no puede ser negativo.");

        if (stockQuantity < 0)
            return Result<Product>.Failure("El stock no puede ser negativo.");

        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = name.Trim(),
            Sku = sku.Trim().ToUpperInvariant(),
            Description = description?.Trim() ?? string.Empty,
            Price = price,
            StockQuantity = stockQuantity,
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow
        };

        return Result<Product>.Success(product);
    }
}
