---
name: zod-schema
description: Runtime validation and TypeScript type inference using Zod schemas at API boundaries and form inputs.
---

# Skill: Validación con Zod Schemas

Diseño de contratos fuertemente tipados y validados en tiempo de ejecución con **Zod**.

## Principios Fundamentales
1. **Contratos Únicos**: Definir el esquema `*.schema.ts` y derivar los tipos estáticos mediante `z.infer<typeof Schema>`. Nunca duplicar manualmente `interface` y `Schema`.
2. **Validación en los Límites**: Parsear las respuestas del backend o payloads de formularios antes de procesar (`schema.parse` o `schema.safeParse`).
3. **Composición de Esquemas**:
   - `.omit({ id: true })` para crear operaciones.
   - `.partial()` para actualizaciones.
   - `.pick({ name: true })` para campos específicos.

## Ejemplo Canónico
```typescript
import { z } from 'zod';

export const ProductSchema = z.object({
    id: z.number().int(),
    name: z.string().min(1, 'El nombre es requerido').max(150),
    sku: z.string().min(1, 'El SKU es requerido'),
    price: z.coerce.number().positive('El precio debe ser positivo'),
    stockQuantity: z.coerce.number().int().nonnegative(),
});

export type Product = z.infer<typeof ProductSchema>;

export const CreateProductSchema = ProductSchema.omit({ id: true });
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
```
