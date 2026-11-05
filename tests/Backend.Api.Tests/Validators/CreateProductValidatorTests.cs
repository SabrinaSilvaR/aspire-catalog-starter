using Backend.Api.Endpoints.Products;
using FluentAssertions;
using Xunit;

namespace Backend.Api.Tests.Validators;

public class CreateProductValidatorTests
{
    private readonly CreateProductValidator _validator = new();

    [Fact]
    public async Task Should_Pass_When_RequestIsValid()
    {
        // Arrange
        var request = new CreateProductRequest("Monitor 4K", "MON-4K", "Monitor Ultra HD", 299.99m, 10);

        // Act
        var result = await _validator.ValidateAsync(request, TestContext.Current.CancellationToken);

        // Assert
        result.IsValid.Should().BeTrue();
        result.Errors.Should().BeEmpty();
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public async Task Should_Fail_When_NameIsNullOrEmpty(string? invalidName)
    {
        // Arrange
        var request = new CreateProductRequest(invalidName!, "MON-4K", "Desc", 100m, 5);

        // Act
        var result = await _validator.ValidateAsync(request, TestContext.Current.CancellationToken);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateProductRequest.Name));
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public async Task Should_Fail_When_SkuIsNullOrEmpty(string? invalidSku)
    {
        // Arrange
        var request = new CreateProductRequest("Producto Test", invalidSku!, "Desc", 100m, 5);

        // Act
        var result = await _validator.ValidateAsync(request, TestContext.Current.CancellationToken);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateProductRequest.Sku));
    }

    [Fact]
    public async Task Should_Fail_When_PriceIsNegative()
    {
        // Arrange
        var request = new CreateProductRequest("Producto Test", "SKU-001", "Desc", -10m, 5);

        // Act
        var result = await _validator.ValidateAsync(request, TestContext.Current.CancellationToken);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateProductRequest.Price));
    }

    [Fact]
    public async Task Should_Fail_When_StockQuantityIsNegative()
    {
        // Arrange
        var request = new CreateProductRequest("Producto Test", "SKU-001", "Desc", 50m, -1);

        // Act
        var result = await _validator.ValidateAsync(request, TestContext.Current.CancellationToken);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateProductRequest.StockQuantity));
    }
}
