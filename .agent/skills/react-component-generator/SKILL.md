---
name: react-component-generator
description: Generates typed React 19 functional components, hooks, responsive layouts, and state management in Vite + TypeScript.
---

# Skill: React Component Generator

Esta habilidad rige la creación y extensión de componentes de interfaz de usuario en `frontend/src/components/`.

## 1. Convenciones Obligatorias
- **TypeScript Estricto**: Todo componente define una interfaz explícita de `Props`.
- **Importaciones Limpias**: Si se importa solo un tipo, usar `import type { ... } from '...'` (debido a `verbatimModuleSyntax`).
- **Estados de Carga y Error**: Cualquier componente que haga peticiones debe contemplar visualmente:
  1. Estado de carga (`loading`).
  2. Estado de error (`error` con mensaje amigable).
  3. Estado vacío (`empty state` si la lista no tiene elementos).
- **Rutas Relativas**: Las llamadas a la API deben usar rutas relativas `/api/...` para que el proxy de Vite y Aspire enrute correctamente la solicitud.

## 2. Plantilla Base
Consulta [`templates/ReactComponent.tsx.template`](./templates/ReactComponent.tsx.template).

## 3. Ejemplo de Referencia
Consulta [`examples/SupplierCatalogExample.tsx.txt`](./examples/SupplierCatalogExample.tsx.txt).
