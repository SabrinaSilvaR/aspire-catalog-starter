---
name: aspire-harness-orchestrator
description: Guides the configuration and extension of .NET Aspire 9.0 AppHost to orchestrate containers, databases, caching, and frontend apps.
---

# Skill: .NET Aspire Harness Orchestrator

Esta habilidad rige cómo se orquestan y agregan nuevos componentes, contenedores o servicios dentro del AppHost (`harness/ProyectoFullstack.AppHost/Program.cs`).

## 1. Convenciones Obligatorias
- **Nombres de Recursos**: Utilizar nombres en minúsculas sencillos (`"sqlserver"`, `"redis"`, `"backend-api"`, `"frontend"`).
- **Referencias Explícitas**: Los proyectos que consuman infraestructura deben vincularse explícitamente con `.WithReference(recurso)`.
- **Inyección Transparente**: No quemar puertos fijos para contenedores internos; Aspire asigna puertos dinámicos para evitar conflictos locales.
- **Frontend SPA**: Las aplicaciones Vite/Node se registran mediante `.AddNpmApp(nombre, ruta, script)` y se enlazan con `.WithReference(backendApi)`.

## 2. Plantilla Base
Consulta [`templates/AppHostServiceRegistration.cs.template`](./templates/AppHostServiceRegistration.cs.template).

## 3. Ejemplo de Referencia
Consulta [`examples/AddPostgresOrRabbitMqExample.cs.txt`](./examples/AddPostgresOrRabbitMqExample.cs.txt).
