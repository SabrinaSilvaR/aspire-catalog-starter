---
name: efcore-entity-manager
description: Manages Entity Framework Core configurations, database mappings for SQL Server, unique indexes, and schema definitions.
---

# Skill: EF Core Entity Manager

Esta habilidad rige el modelado de entidades y mapeo relacional en `src/Backend.Infrastructure/Persistence/`.

## 1. Convenciones Obligatorias
- Todas las configuraciones implementan `IEntityTypeConfiguration<T>`.
- Claves primarias siempre tipadas con `Guid` o `int` según la necesidad de dominio.
- Columnas de texto deben tener `.IsRequired()` y longitud máxima explícita `.HasMaxLength(N)`.
- Valores monetarios deben declarar precisión: `.HasPrecision(18, 2)`.
- Índices únicos para identificadores de negocio (RUT, SKU, Email).

## 2. Plantilla Base
Consulta [`templates/EntityConfiguration.cs.template`](./templates/EntityConfiguration.cs.template).

## 3. Ejemplo de Referencia
Consulta [`examples/SupplierConfigurationExample.cs.txt`](./examples/SupplierConfigurationExample.cs.txt).
