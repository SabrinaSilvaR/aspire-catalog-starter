---
name: vitest-tdd
description: Test-driven development with Vitest, React Testing Library, and accessible userEvent testing.
---

# Skill: Vitest TDD (Frontend)

Flujo de pruebas unitarias y de componentes utilizando **Vitest** y **React Testing Library**.

## Ciclo Red → Green → Refactor
1. **Red**: Escribir la prueba reflejando el requerimiento del usuario; verificar que falle por la razón esperada (`npm run test:run`).
2. **Green**: Implementar la lógica mínima necesaria para satisfacer el test.
3. **Refactor**: Limpiar el código manteniendo la suite en verde.

## Buenas Prácticas con Testing Library
- **Consultas Semánticas**: Usar siempre `screen.getByRole`, `screen.getByLabelText` o `screen.getByText`. Prohibido acceder directamente a nodos DOM o usar `container.querySelector`.
- **Interacciones de Usuario**: Utilizar `userEvent.setup()` y llamadas asíncronas `await user.click(...)`.
- **Aserciones Claras**: Usar matchers de `@testing-library/jest-dom` como `toBeInTheDocument()`, `toBeDisabled()`, etc.
- **Mocking mediante IoC**: En lugar de mockear módulos con `vi.mock()`, inyectar dobles de prueba vía `InversionOfControlProvider`.

## Estructura de Test
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button.tsx';

describe('Button', () => {
    it('ejecuta el callback onClick al hacer clic', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();

        render(<Button onClick={handleClick}>Guardar</Button>);
        await user.click(screen.getByRole('button', { name: /guardar/i }));

        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
```
