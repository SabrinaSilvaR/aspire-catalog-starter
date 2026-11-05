---
name: atomic-design
description: Organizes React components strictly following Atomic Design principles (atoms, molecules, organisms, layouts, pages).
---

# Skill: Atomic Design (Frontend)

Organiza la interfaz de usuario bajo la metodología **Atomic Design**. Todo componente tiene un nivel específico y se compone **estrictamente de forma ascendente**.

## Jerarquía de Niveles

| Nivel | Ubicación | Descripción | Ejemplos |
| :--- | :--- | :--- | :--- |
| **Átomos** | `src/app/components/atoms/` | Bloques más pequeños, presentacionales, sin lógica de negocio ni estado de red. | `Button`, `Input`, `Badge`, `Spinner`, `Logo` |
| **Moléculas** | `src/app/components/molecules/` | Combinación de 2 o más átomos para formar una unidad simple. | `FormField` (Label + Input + Error), `SearchBox` |
| **Organismos** | `src/app/components/organisms/` | Secciones complejas y autocontenidas. Pueden consumir estado y servicios inyectados. | `Header`, `ProductCatalog`, `LoginForm` |
| **Layouts** | `src/app/layouts/` | Esqueleto estructural de páginas sin datos reales. | `AppLayout`, `AuthLayout` |
| **Páginas** | `src/app/pages/` | Vistas conectadas a rutas que integran layouts, organismos, estado y servicios. | `CatalogPage`, `SettingsPage` |

## Reglas Obligatorias

1. **Composición ascendente única**: Moléculas usan átomos; organismos usan moléculas y átomos; layouts ordenan organismos; páginas usan layouts. **Nunca en sentido inverso**.
2. **Átomos y Moléculas son puros**: Reciben `props`, emiten callbacks y JSX. Cero llamadas `fetch`, cero lectura de stores globales.
3. **Inyección en Organismos y Páginas**: La inyección de dependencias (`useInjection`) y lectura de estado global (`useAtom`) se hace en organismos o páginas.
4. **Colocación de Estilos**: Co-locar CSS Modules (`*.module.css`) junto a cada componente, complementado con clases atómicas de UnoCSS.
