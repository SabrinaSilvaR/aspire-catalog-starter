---
name: openapi-client-generator
description: Guides the generation and synchronization of TypeScript types and HTTP client wrappers from the backend OpenAPI/Swagger specification.
---

# Skill: OpenAPI Client & Types Generator

Esta habilidad rige cómo el Frontend consume y sincroniza contratos con el Backend evitando escribir interfaces a mano.

## 1. Convenciones Obligatorias
- La fuente de verdad para los tipos es el endpoint del backend: `http://localhost:5100/openapi/v1.json` o `specs/specs/`.
- Los tipos generados se ubican en `frontend/src/api/types.ts`.
- Las llamadas a endpoints deben utilizar clientes tipados con control de excepciones HTTP bajo RFC 7807 (ProblemDetails).

## 2. Generación Automática vía CLI
Cuando la API está en ejecución, se puede regenerar el esquema con:
```bash
npx openapi-typescript http://localhost:5100/openapi/v1.json -o src/api/schema.d.ts
```

## 3. Plantilla Base
Consulta [`templates/api-client.ts.template`](./templates/api-client.ts.template).

## 4. Ejemplo de Referencia
Consulta [`examples/SupplierApiClientExample.ts.txt`](./examples/SupplierApiClientExample.ts.txt).
