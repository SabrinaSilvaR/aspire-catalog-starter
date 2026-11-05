---
name: efcore-entity-manager
description: Manages Entity Framework Core configurations, database mappings for SQL Server, unique indexes, and schema definitions.
---

# Skill: EF Core Entity Manager

Esta habilidad rige el modelado de entidades, configuraciones fluidas y persistencia relacional en `src/Backend.Api/Infrastructure/Persistence/`.

## 1. Convenciones Obligatorias
- **Entidades POCO**: Las entidades viven en `src/Backend.Api/Domain/Entities/` (namespace `Backend.Domain.Entities`). Mantenerlas limpias de lógica de infraestructura; encapsular invariantes mediante métodos de fábrica estáticos (ej. `Product.Create(...)`).
- **Configuración Separada**: Toda entidad cuenta con una configuración explícita que implementa `IEntityTypeConfiguration<T>` en `src/Backend.Api/Infrastructure/Persistence/Configurations/` (namespace `Backend.Infrastructure.Persistence.Configurations`).
- **Tipado de Columnas**:
  - Claves primarias declaradas explícitamente (`builder.HasKey(x => x.Id)`).
  - Columnas de texto deben tener `.IsRequired()` y longitud máxima explícita `.HasMaxLength(N)`.
  - Columnas monetarias y decimales deben declarar precisión obligatoria: `.HasPrecision(18, 2)`.
  - Índices únicos para identificadores de negocio (ej. `builder.HasIndex(x => x.Sku).IsUnique()`).
- **Migraciones Controladas**:
  - Cada cambio estructural de base de datos se genera mediante `dotnet ef migrations add <NombreMigracion>`.
  - Revisar el código de la migración generada antes de aplicarla.
  - Prohibido modificar migraciones históricas ya aplicadas en ambientes compartidos.

## 2. Inyección de DbContext en Aspire
- El `ApplicationDbContext` recibe la cadena de conexión inyectada automáticamente por el AppHost (`AddSqlServer("sqlserver").AddDatabase("CatalogDb")`).
- Nunca quemar cadenas de conexión en archivos de configuración.

## 3. Ejemplo de Configuración Fluida
```csharp
public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.Sku)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(p => p.Sku)
            .IsUnique();

        builder.Property(p => p.Price)
            .HasPrecision(18, 2);
    }
}
```
