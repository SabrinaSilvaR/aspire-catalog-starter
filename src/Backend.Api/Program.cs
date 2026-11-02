using Backend.Infrastructure;
using Backend.Infrastructure.Persistence;
using Backend.ServiceDefaults;
using FastEndpoints;
using FastEndpoints.Swagger;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Telemetría, Service Discovery y Resiliencia provistas por Aspire
builder.AddServiceDefaults();

// Logging Estructurado
builder.Host.UseSerilog((context, lc) =>
{
    lc.ReadFrom.Configuration(context.Configuration)
      .Enrich.FromLogContext()
      .WriteTo.Console();
});

// Configuración de Capas
builder.Services.AddInfrastructure(builder.Configuration);

// CORS para permitir peticiones del Frontend React en desarrollo
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// FastEndpoints & OpenAPI
builder.Services.AddFastEndpoints(o =>
{
    o.Assemblies = [typeof(Program).Assembly];
});

builder.Services.SwaggerDocument(o =>
{
    o.DocumentSettings = s =>
    {
        s.Title = "Proyecto Fullstack API (FastEndpoints + Aspire)";
        s.Version = "v1";
        s.Description = "API del Backend orquestada por .NET Aspire con soporte de SQL Server y Redis";
    };
    o.ShortSchemaNames = true;
});

var app = builder.Build();

// Endpoints de salud y telemetría de Aspire (/health, /alive)
app.MapDefaultEndpoints();

// Inicialización de la base de datos
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await db.Database.EnsureCreatedAsync();
}

app.UseCors("AllowFrontend");

app.UseFastEndpoints();
app.UseSwaggerGen();

app.MapGet("/", () => Results.Redirect("/swagger")).ExcludeFromDescription();

app.Run();

public partial class Program { }
