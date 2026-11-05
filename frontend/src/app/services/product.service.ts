import {
  type CreateProductInput,
  type ListProductsResponse,
  ListProductsResponseSchema,
  type Product,
  ProductSchema,
} from '../schemas/product.schema.ts';

export interface IProductService {
  listProducts(): Promise<ListProductsResponse>;
  createProduct(data: CreateProductInput): Promise<Product>;
}

export class ProductService implements IProductService {
  private readonly baseUrl: string;

  constructor(baseUrl: string = '/api/products') {
    this.baseUrl = baseUrl;
  }

  async listProducts(): Promise<ListProductsResponse> {
    const res = await fetch(this.baseUrl);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const data: unknown = await res.json();
    return ListProductsResponseSchema.parse(data);
  }

  async createProduct(payload: CreateProductInput): Promise<Product> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data: unknown = await res.json();
    return ProductSchema.parse(data);
  }
}
