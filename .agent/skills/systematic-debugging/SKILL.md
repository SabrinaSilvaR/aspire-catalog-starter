---
name: systematic-debugging
description: 4-phase systematic debugging workflow for isolating, diagnosing, and resolving issues with regression prevention.
---

# Skill: Systematic Debugging (Frontend, Backend & Harness)

Metodología sistemática para resolver errores sin saltar a conclusiones apresuradas ni generar efectos colaterales.

## Cuándo Utilizar
Al enfrentarse a una prueba fallida, excepción no controlada, error de compilación, o comportamiento inesperado reportado por el usuario o por el agente `qa-guardian`.

## Checklist de Diagnóstico Rápido

### 1. Frontend (React 19 + Vite + IoC)
| Síntoma | Posible Causa | Verificación |
| :--- | :--- | :--- |
| `Cannot find module '#libs/...'` | Alias o exports no mapeados | Revisar `package.json#imports` y `tsconfig.app.json#paths` |
| `ZodError: Expected ..., received ...` | Inconsistencia entre API y Schema | Inspeccionar payload HTTP en la pestaña Network / test |
| `useInjection returns undefined` | Dependencia no registrada | Verificar `container.bind(...)` en `app.ioc.ts` |
| Fallo en `Button onClick` en tests | Simulación de submit en form | Usar `fireEvent.submit(form)` para validaciones complejas de DOM |
| Estilos no aplican | Falta de import de UnoCSS | Verificar `import 'virtual:uno.css'` en `main.tsx` |

### 2. Integración y Aspire Harness
| Síntoma | Posible Causa | Verificación |
| :--- | :--- | :--- |
| `ECONNREFUSED /api/...` | Backend caído o proxy desconfigurado | Verificar `proxy` en `vite.config.ts` y que el backend esté arriba |
| Error 500 en FastEndpoints | Fallo de base de datos o validación | Revisar logs del contenedor SQL Server en Aspire Dashboard |
| Error de CORS | Endpoint consumido con URL absoluta | Usar siempre rutas relativas `/api/...` para que el proxy enrute |

## Flujo Operativo Red-Green
1. **Aislar**: Ejecutar `npm run test:run path/to/failing.spec.tsx`.
2. **Reproducir**: Si el bug no tiene test, escribirlo primero en `*.spec.tsx` o `*.Tests/`.
3. **Reparar**: Modificar únicamente las líneas estrictamente necesarias.
4. **Verificar**: Comprobar que el test pasa y que `npm run build` y `npm run test:run` están 100% limpios.
