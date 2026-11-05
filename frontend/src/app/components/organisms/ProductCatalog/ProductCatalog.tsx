import { type ChangeEvent, type FormEvent, useCallback, useEffect, useState } from 'react';
import type { ZodIssue } from 'zod';
import { useInjection } from '@/app/app.ioc.ts';
import { Button } from '@/app/components/atoms/Button/Button.tsx';
import { Input } from '@/app/components/atoms/Input/Input.tsx';
import {
  CreateProductInputSchema,
  type Product,
} from '@/app/schemas/product.schema.ts';
import { ProductService } from '@/app/services/product.service.ts';
import styles from './ProductCatalog.module.css';

export const ProductCatalog = () => {
  const productService = useInjection(ProductService);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [fromCache, setFromCache] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('29.99');
  const [stock, setStock] = useState('100');
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.listProducts();
      setProducts(data.items);
      setFromCache(data.fromCache);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error inesperado';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [productService]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const parseResult = CreateProductInputSchema.safeParse({
      name,
      sku,
      description: 'Creado vía Frontend Senior con IoC y Zod',
      price,
      stockQuantity: stock,
    });

    if (!parseResult.success) {
      const errors: Record<string, string> = {};
      parseResult.error.issues.forEach((issue: ZodIssue) => {
        const fieldName = issue.path[0]?.toString() || 'general';
        errors[fieldName] = issue.message;
      });
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await productService.createProduct(parseResult.data);
      setName('');
      setSku('');
      await loadProducts();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al registrar el producto';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Catálogo de Productos</h2>
          <p className={styles.subtitle}>
            Arquitectura desacoplada mediante IoC, Zod schemas y componentes atómicos
          </p>
        </div>
        <div className={styles.badges}>
          <span className={styles.badge}>Total: {products.length}</span>
          <span className={`${styles.badge} ${fromCache ? styles.cacheHit : styles.cacheMiss}`}>
            {fromCache ? '⚡ Redis Caché' : '🗄️ SQL Server'}
          </span>
        </div>
      </header>

      {error ? (
        <div className={styles.errorBox} role="alert">
          <p>⚠️ {error}</p>
          <Button variant="outline" onClick={loadProducts}>
            Reintentar
          </Button>
        </div>
      ) : null}

      <div className={styles.layout}>
        {/* Formulario */}
        <form onSubmit={handleCreate} className={styles.formCard} aria-label="Nuevo Producto">
          <h3 className={styles.formTitle}>Nuevo Producto</h3>
          <Input
            label="Nombre"
            name="name"
            placeholder="Ej. Teclado Mecánico"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            error={formErrors.name}
            required
          />
          <Input
            label="SKU"
            name="sku"
            placeholder="Ej. TEC-001"
            value={sku}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSku(e.target.value)}
            error={formErrors.sku}
            required
          />
          <div className={styles.formRow}>
            <Input
              label="Precio ($)"
              name="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
              error={formErrors.price}
              required
            />
            <Input
              label="Stock"
              name="stockQuantity"
              type="number"
              value={stock}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setStock(e.target.value)}
              error={formErrors.stockQuantity}
              required
            />
          </div>
          <Button type="submit" isLoading={submitting} className={styles.submitBtn}>
            Agregar al Catálogo
          </Button>
        </form>

        {/* Lista / Estados */}
        <div className={styles.listContainer}>
          {loading && products.length === 0 ? (
            <div className={styles.emptyState} aria-busy="true">
              <p>⏳ Cargando productos desde Aspire Harness...</p>
            </div>
          ) : null}

          {!loading && products.length === 0 && !error ? (
            <div className={styles.emptyState}>
              <p>📦 No hay productos registrados aún.</p>
            </div>
          ) : null}

          <div className={styles.grid}>
            {products.map((p) => (
              <article key={p.id} className={styles.productCard}>
                <div className={styles.cardHeader}>
                  <h4 className={styles.productName}>{p.name}</h4>
                  <span className={styles.skuBadge}>{p.sku}</span>
                </div>
                <p className={styles.productDescription}>{p.description}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.priceTag}>${p.price.toFixed(2)}</span>
                  <span className={styles.stockTag}>{p.stockQuantity} en stock</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
