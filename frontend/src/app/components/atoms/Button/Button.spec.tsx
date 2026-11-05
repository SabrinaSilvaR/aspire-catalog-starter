import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button.tsx';

describe('Button (Atom)', () => {
  it('renderiza el contenido correctamente', () => {
    render(<Button>Guardar Producto</Button>);
    expect(screen.getByRole('button', { name: /guardar producto/i })).toBeInTheDocument();
  });

  it('ejecuta onClick al interactuar', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Acción</Button>);
    await user.click(screen.getByRole('button', { name: /acción/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('deshabilita el botón y muestra estado de carga cuando isLoading es true', () => {
    render(<Button isLoading>Cargando</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
  });
});
