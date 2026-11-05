import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'El nombre es requerido'),
  sku: z.string().min(1, 'El SKU es requerido'),
  description: z.string().default(''),
  price: z.coerce.number().min(0, 'El precio debe ser mayor o igual a 0'),
  stockQuantity: z.coerce.number().int().min(0, 'El stock no puede ser negativo'),
  isActive: z.boolean().default(true),
  createdAtUtc: z.string().optional(),
});

export type Product = z.infer<typeof ProductSchema>;

export const ListProductsResponseSchema = z.object({
  items: z.array(ProductSchema).default([]),
  totalCount: z.number().default(0),
  fromCache: z.boolean().default(false),
});

export type ListProductsResponse = z.infer<typeof ListProductsResponseSchema>;

export const CreateProductInputSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  sku: z.string().min(1, 'El SKU es requerido'),
  description: z.string().default(''),
  price: z.coerce.number().min(0, 'El precio no puede ser negativo'),
  stockQuantity: z.coerce.number().int().min(0, 'El stock no puede ser negativo'),
});

export type CreateProductInput = z.infer<typeof CreateProductInputSchema>;
