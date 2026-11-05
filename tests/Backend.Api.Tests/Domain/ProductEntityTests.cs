using Backend.Domain.Entities;
using FluentAssertions;
using Xunit;

namespace Backend.Api.Tests.Domain;

public class ProductEntityTests
{
    [Fact]
    public void Should_CreateProductSuccessfully_When_ValidParameters()
    {
        // Act
        var result = Product.Create("Teclado Mecánico", "tec-001", "Teclado RGB", 89.90m, 25);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().NotBeNull();
        result.Value!.Name.Should().Be("Teclado Mecánico");
        result.Value.Sku.Should().Be("TEC-001"); // Convierte a mayúsculas
        result.Value.Price.Should().Be(89.90m);
        result.Value.StockQuantity.Should().Be(25);
        result.Value.IsActive.Should().BeTrue();
        result.Value.Id.Should().NotBeEmpty();
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Should_FailCreation_When_NameIsWhitespace(string invalidName)
    {
        // Act
        var result = Product.Create(invalidName, "SKU-001", "Desc", 10m, 1);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Contain("nombre");
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Should_FailCreation_When_SkuIsWhitespace(string invalidSku)
    {
        // Act
        var result = Product.Create("Producto", invalidSku, "Desc", 10m, 1);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Contain("SKU");
    }

    [Fact]
    public void Should_FailCreation_When_PriceIsNegative()
    {
        // Act
        var result = Product.Create("Producto", "SKU-001", "Desc", -5m, 1);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Contain("precio");
    }

    [Fact]
    public void Should_FailCreation_When_StockIsNegative()
    {
        // Act
        var result = Product.Create("Producto", "SKU-001", "Desc", 10m, -1);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Contain("stock");
    }
}
