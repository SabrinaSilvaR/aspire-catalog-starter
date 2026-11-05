using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Backend.Infrastructure.Persistence;

/// <summary>
/// Usada solo por las herramientas de diseño de EF Core (dotnet ef migrations ...).
/// Genera el historial de migraciones contra SQL Server, el proveedor real que orquesta Aspire;
/// la cadena de conexión aquí nunca se usa en tiempo de ejecución.
/// </summary>
public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        optionsBuilder.UseSqlServer(
            "Server=localhost;Database=CatalogDb;Trusted_Connection=True;TrustServerCertificate=True;");

        return new ApplicationDbContext(optionsBuilder.Options);
    }
}
