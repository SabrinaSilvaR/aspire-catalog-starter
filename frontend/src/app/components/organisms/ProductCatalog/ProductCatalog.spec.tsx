import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { InversionOfControlProvider } from '@/app/app.ioc.ts';
import { ProductCatalog } from './ProductCatalog.tsx';
import { ProductService } from '@/app/services/product.service.ts';
import type { IProductService } from '@/app/services/product.service.ts';

describe('ProductCatalog (Organism with IoC)', () => {
  let mockProductService: IProductService;

  beforeEach(() => {
    mockProductService = {
      listProducts: vi.fn().mockResolvedValue({
        items: [
          {
            id: '1',
            name: 'Monitor 4K',
            sku: 'MON-4K',
            description: 'Monitor Ultra HD',
            price: 299.99,
            stockQuantity: 15,
            isActive: true,
          },
        ],
        totalCount: 1,
        fromCache: false,
      }),
      createProduct: vi.fn().mockResolvedValue({
        id: '2',
        name: 'Mouse Inalámbrico',
        sku: 'MOU-001',
        description: 'Mouse ergonómico',
        price: 49.99,
        stockQuantity: 50,
        isActive: true,
      }),
    };
  });

  const renderWithIoC = () => {
    const mockContainer = new Map();
    mockContainer.set(ProductService, mockProductService);

    return render(
      <InversionOfControlProvider values={mockContainer}>
        <ProductCatalog />
      </InversionOfControlProvider>,
    );
  };

  it('carga y renderiza la lista de productos vía IoC service', async () => {
    renderWithIoC();

    expect(await screen.findByText('Monitor 4K')).toBeInTheDocument();
    expect(screen.getByText('MON-4K')).toBeInTheDocument();
    expect(screen.getByText('$299.99')).toBeInTheDocument();
  });

  it('muestra estado vacío cuando no existen productos', async () => {
    mockProductService.listProducts = vi.fn().mockResolvedValue({
      items: [],
      totalCount: 0,
      fromCache: false,
    });

    renderWithIoC();

    expect(
      await screen.findByText(/No hay productos registrados aún/i),
    ).toBeInTheDocument();
  });

  it('muestra alerta de error cuando el servicio falla', async () => {
    mockProductService.listProducts = vi
      .fn()
      .mockRejectedValue(new Error('Fallo de conexión en Aspire'));

    renderWithIoC();

    expect(
      await screen.findByText(/Fallo de conexión en Aspire/i),
    ).toBeInTheDocument();
  });

  it('valida con Zod y envía nuevo producto a través del servicio', async () => {
    const user = userEvent.setup();
    renderWithIoC();

    await screen.findByText('Monitor 4K');

    const nameInput = screen.getByLabelText(/Nombre/i);
    const skuInput = screen.getByLabelText(/SKU/i);
    await user.type(nameInput, 'Mouse Inalámbrico');
    await user.type(skuInput, 'MOU-001');

    const form = screen.getByRole('form', { name: /Nuevo Producto/i });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockProductService.createProduct).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Mouse Inalámbrico',
          sku: 'MOU-001',
        }),
      );
    });
  });
});
