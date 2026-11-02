import { useEffect, useState } from 'react'
import type { CreateProductRequest, ListProductsResponse, ProductDto } from './api/types'
import './App.css'

export function App() {
  const [products, setProducts] = useState<ProductDto[]>([])
  const [loading, setLoading] = useState(false)
  const [fromCache, setFromCache] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [price, setPrice] = useState('29.99')
  const [stock, setStock] = useState('100')
  const [submitting, setSubmitting] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/products')
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      const data: ListProductsResponse = await res.json()
      setProducts(data.items || [])
      setFromCache(data.fromCache)
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el backend')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !sku) return

    setSubmitting(true)
    setError(null)
    try {
      const payload: CreateProductRequest = {
        name,
        sku,
        description: 'Creado desde el Frontend React vía Aspire Harness',
        price: parseFloat(price) || 0,
        stockQuantity: parseInt(stock, 10) || 0,
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Error al crear producto')
      }

      setName('')
      setSku('')
      await fetchProducts()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#646cff' }}>
          🚀 Proyecto Fullstack: Harness Multi-Agente
        </h1>
        <p style={{ margin: '0.5rem 0 0', color: '#888' }}>
          Orquestado por <strong>.NET Aspire 9.0</strong> | Backend <strong>FastEndpoints .NET 10</strong> | Frontend <strong>React + Vite + TS</strong>
        </p>
      </header>

      {/* Status Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1rem', background: '#1a1a24', borderRadius: 8, border: '1px solid #2a2a38' }}>
          <div style={{ fontSize: '0.85rem', color: '#888' }}>Backend API</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: error ? '#ff6b6b' : '#51cf66' }}>
            {error ? 'Desconectado' : 'Conectado (/api)'}
          </div>
        </div>
        <div style={{ padding: '1rem', background: '#1a1a24', borderRadius: 8, border: '1px solid #2a2a38' }}>
          <div style={{ fontSize: '0.85rem', color: '#888' }}>Persistencia SQL</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#339af0' }}>
            SQL Server 2022
          </div>
        </div>
        <div style={{ padding: '1rem', background: '#1a1a24', borderRadius: 8, border: '1px solid #2a2a38' }}>
          <div style={{ fontSize: '0.85rem', color: '#888' }}>Caché Distribuido</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: fromCache ? '#ffd43b' : '#cc5de8' }}>
            {fromCache ? '⚡ Desde Redis (Hit)' : '🗄️ Desde Base de Datos'}
          </div>
        </div>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: '#381616', border: '1px solid #ff6b6b', borderRadius: 8, marginBottom: '1.5rem', color: '#ff8787' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Formulario de Alta */}
      <section style={{ background: '#16161e', padding: '1.5rem', borderRadius: 8, marginBottom: '2rem', border: '1px solid #262636' }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.2rem' }}>➕ Crear Nuevo Producto</h2>
        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="Nombre del producto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid #444', background: '#222', color: '#fff' }}
          />
          <input
            type="text"
            placeholder="SKU (ej: PROD-001)"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            required
            style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid #444', background: '#222', color: '#fff' }}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Precio"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid #444', background: '#222', color: '#fff' }}
          />
          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid #444', background: '#222', color: '#fff' }}
          />
          <button
            type="submit"
            disabled={submitting}
            style={{ padding: '0.6rem', background: '#646cff', border: 'none', borderRadius: 6, color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {submitting ? 'Guardando...' : 'Crear Producto'}
          </button>
        </form>
      </section>

      {/* Catálogo de Productos */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>📦 Catálogo de Productos ({products.length})</h2>
          <button
            onClick={fetchProducts}
            disabled={loading}
            style={{ padding: '0.4rem 0.8rem', background: '#333', border: '1px solid #555', borderRadius: 6, color: '#fff', cursor: 'pointer' }}
          >
            {loading ? 'Cargando...' : '🔄 Recargar Catálogo'}
          </button>
        </div>

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666', background: '#121218', borderRadius: 8 }}>
            No hay productos registrados en el catálogo. ¡Crea el primero arriba!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#16161e', borderRadius: 8, overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: '#222230', borderBottom: '1px solid #333' }}>
                  <th style={{ padding: '0.75rem' }}>Nombre</th>
                  <th style={{ padding: '0.75rem' }}>SKU</th>
                  <th style={{ padding: '0.75rem' }}>Precio</th>
                  <th style={{ padding: '0.75rem' }}>Stock</th>
                  <th style={{ padding: '0.75rem' }}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #262636' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 500 }}>{p.name}</td>
                    <td style={{ padding: '0.75rem', color: '#888' }}>{p.sku}</td>
                    <td style={{ padding: '0.75rem', color: '#51cf66' }}>${p.price.toFixed(2)}</td>
                    <td style={{ padding: '0.75rem' }}>{p.stockQuantity} un.</td>
                    <td style={{ padding: '0.75rem', color: '#666', fontSize: '0.85rem' }}>
                      {new Date(p.createdAtUtc).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default App
