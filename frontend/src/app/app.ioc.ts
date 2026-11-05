import { createContainer } from '#libs/ioc/index.ts';
import { ProductService } from './services/product.service.ts';

export const { container, InversionOfControlProvider, useInjection } =
  createContainer();

// Bindings predeterminados
container.bind(ProductService, new ProductService());
