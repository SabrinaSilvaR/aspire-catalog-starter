using Backend.Application.Common.Interfaces;
using Backend.Infrastructure.Persistence;
using Backend.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Backend.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Conexión a Base de Datos (SQL Server con fallback a SQLite)
        var connectionString = configuration.GetConnectionString("CatalogDb") 
            ?? configuration.GetConnectionString("DefaultConnection");

        var databaseProvider = configuration["DatabaseProvider"] 
            ?? (!string.IsNullOrWhiteSpace(connectionString) && connectionString.Contains("Server=") ? "SqlServer" : "Sqlite");

        services.AddDbContext<ApplicationDbContext>(options =>
        {
            if (databaseProvider.Equals("SqlServer", StringComparison.OrdinalIgnoreCase) && !string.IsNullOrWhiteSpace(connectionString))
            {
                options.UseSqlServer(connectionString, sqlOptions =>
                {
                    sqlOptions.EnableRetryOnFailure(5, TimeSpan.FromSeconds(30), null);
                });
            }
            else
            {
                options.UseSqlite(connectionString ?? "Data Source=app.db");
            }
        });

        services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<ApplicationDbContext>());

        // Conexión a Redis con fallback suave a memoria
        var redisConn = configuration.GetConnectionString("redis") 
            ?? configuration.GetConnectionString("Redis");

        if (!string.IsNullOrWhiteSpace(redisConn))
        {
            services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = redisConn;
                options.InstanceName = "Catalog:";
            });
        }
        else
        {
            services.AddDistributedMemoryCache();
        }

        services.AddTransient<ICacheService, CacheService>();

        return services;
    }

    /// <summary>
    /// Prepara el esquema de base de datos al iniciar la aplicación.
    /// SQL Server (el proveedor orquestado por Aspire) usa el historial de migraciones versionado;
    /// SQLite (fallback local sin contenedor) usa EnsureCreated porque es un almacén descartable.
    /// </summary>
    public static async Task InitializeDatabaseAsync(this IServiceProvider services, CancellationToken ct = default)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        if (db.Database.IsSqlServer())
        {
            await db.Database.MigrateAsync(ct);
        }
        else
        {
            await db.Database.EnsureCreatedAsync(ct);
        }
    }
}
