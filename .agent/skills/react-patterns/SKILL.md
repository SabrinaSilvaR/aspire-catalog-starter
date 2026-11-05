---
name: react-patterns
description: Core React 19 patterns, composition over inheritance, hook separation, and accessibility conventions.
---

# Skill: React Patterns (React 19 + TypeScript)

Guía de patrones reactivos modernos para SPA con React 19 y TypeScript.

## 1. Principios de Componentes
- **Composición sobre Props**: Usar `children` o slots en lugar de prop-drilling excesivo o multiplicidad de flags booleanas.
- **Unidad de Responsabilidad**: Un componente hace una sola cosa visual. La lógica de negocio y efectos complejos pertenecen a hooks (`useXyz`).
- **Tipado Explícito**: Tipar formalmente `type ComponentProps = { ... }`. Prohibido `any`.

## 2. Hooks y Efectos
- Llamar a los hooks únicamente en el nivel superior de los componentes.
- **`useEffect` sólo para sincronización externa**: Suscripciones, listeners de ventana o librerías imperativas de terceros. Nunca para computar estado derivado o desencadenar flujos en cascada.
- Prefiere `useActionState` y `useOptimistic` en formularios interactivos.

## 3. Manejo de Estado
- **Estado local**: `useState` / `useReducer` dentro del componente.
- **Estado compartido / global**: Átomos de **Jotai** en `src/app/store/*.store.ts`.
- Evitar Context providers masivos que provoquen renderizados innecesarios en cascada.

## 4. Accesibilidad (a11y)
- Utilizar elementos HTML semánticos (`<button type="button">`, `<nav>`, `<main>`, `<article>`).
- Proveer atributos `aria-label`, `aria-busy`, `aria-live` cuando existan estados dinámicos.
- Garantizar que todo componente interactivo sea operable mediante teclado.
