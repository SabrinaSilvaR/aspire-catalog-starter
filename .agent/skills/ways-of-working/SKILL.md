---
name: ways-of-working
description: Senior developer operating manual, Definition of Done, and autonomous decision guidelines.
---

# Skill: Ways of Working & Definition of Done

Manual operativo para agentes que desarrollan sobre el frontend del monorepo.

## 1. Autonomía y Decisiones por Defecto
- **Sesgo hacia la acción**: Tomar decisiones técnicas estándar (patrones de diseño atómico, validaciones Zod, inyección IoC) de forma autónoma.
- **Consultar sólo por requisitos de negocio**: Si una funcionalidad es ambigua a nivel de producto, preguntar opciones concisas. De lo contrario, proceder con el estándar.

## 2. Decisiones Técnicas Predeterminadas
| Escenario | Decisión Predeterminada |
| :--- | :--- |
| Nuevo componente | Iniciar desde los scaffolds `.vscode/__templates__/` |
| Estado local | `useState` en el componente |
| Estado global | Átomo de Jotai en `src/app/store/` |
| Conexión API | Servicio inyectado con IoC (`useInjection`) y validado con Zod |
| Formularios | Controlados, validados con `zod.safeParse` |
| Estilizado | UnoCSS + CSS Modules para especificidad |
| Pruebas | Vitest + React Testing Library colocados junto al componente (`*.spec.tsx`) |

## 3. Definition of Done (Criterios de Aceptación Obligatorios)
Un cambio o componente se considera **TERMINADO** únicamente cuando:
- [x] Pruebas unitarias pasan con éxito (`npm run test:run`).
- [x] Compilación limpia de TypeScript y Vite (`npm run build`).
- [x] Linter sin advertencias ni errores (`npm run lint`).
- [x] Cero `any`, cero configuración o endpoints quemados a mano.
- [x] Manejo explícito de estados: **Cargando** (`loading`), **Error** (`error`), y **Vacío** (`empty`).
- [x] Accesibilidad verificada (roles semánticos y foco de teclado).
