---
name: ioc-binding
description: Inversion of Control container and dependency injection conventions for React services, allowing seamless mocking in tests.
---

# Skill: Inversion of Control (IoC) en React

Establece el desacoplamiento entre componentes UI y servicios mediante el micro-contenedor de IoC `#libs/ioc`.

## Cuándo Utilizar
Al registrar servicios API, clientes HTTP, proveedores de configuración, o al mockear dependencias en pruebas unitarias.

## Registro y Bootstrap (`app.ioc.ts`)
```typescript
import { createContainer } from '#libs/ioc';
import { ProductService } from './services/product.service.ts';

export const { container, InversionOfControlProvider, useInjection } = createContainer();

// Registro de servicios
container.bind(ProductService, new ProductService());
```

## Consumo en Componentes y Hooks
```typescript
import { useInjection } from '@/app/app.ioc.ts';
import { ProductService } from '@/app/services/product.service.ts';

export const useProducts = () => {
    const productService = useInjection(ProductService);
    // ...
};
```

## Mocking en Pruebas Unitarias
El contenedor permite sobreescribir cualquier servicio mediante `InversionOfControlProvider` pasando un `Map` con los mocks sin necesidad de MSW o hacks a nivel de módulo:

```typescript
import { render, screen } from '@testing-library/react';
import { InversionOfControlProvider } from '#libs/ioc';
import { ProductService } from '@/app/services/product.service.ts';
import { ProductCatalog } from './ProductCatalog.tsx';

const mockService: Partial<ProductService> = {
    getProducts: vi.fn().mockResolvedValue([{ id: 1, name: 'Item Test' }]),
};

const mockValues = new Map();
mockValues.set(ProductService, mockService);

render(
    <InversionOfControlProvider values={mockValues}>
        <ProductCatalog />
    </InversionOfControlProvider>
);
```
