var builder = DistributedApplication.CreateBuilder(args);

// 1. Orquestación de Infraestructura (Contenedores gestionados por Aspire)
var sql = builder.AddSqlServer("sqlserver")
                 .AddDatabase("CatalogDb");

var redis = builder.AddRedis("redis");

// 2. Orquestación de Backend API
var backend = builder.AddProject<Projects.Backend_Api>("backend-api")
                     .WithReference(sql)
                     .WithReference(redis);

// 3. Orquestación del Frontend React + Vite + TypeScript
var frontend = builder.AddNpmApp("frontend", "../../frontend", "dev")
                      .WithReference(backend)
                      .WithHttpEndpoint(port: 3000, targetPort: 5173, name: "http");

builder.Build().Run();
