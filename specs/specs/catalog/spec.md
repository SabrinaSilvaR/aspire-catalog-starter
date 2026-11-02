# Especificación de Capacidad: Catálogo de Productos

## 1. Resumen
Permite la administración y consulta en tiempo real del catálogo de productos con aceleración de lecturas en Redis e invalidación atómica en escrituras.

## 2. Contratos de API

### `GET /api/products`
- **Descripción**: Obtiene la lista completa de productos ordenados por fecha de creación descendente.
- **Caché**: Clave `products:list:all` con TTL de 5 minutos en Redis.
- **Respuesta 200 OK**:
  ```json
  {
    "items": [
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "name": "Laptop Pro",
        "sku": "LP-001",
        "description": "Portátil de alta gama",
        "price": 1299.99,
        "stockQuantity": 15,
        "isActive": true,
        "createdAtUtc": "2026-11-02T16:00:00Z"
      }
    ],
    "totalCount": 1,
    "fromCache": true
  }
  ```

### `POST /api/products`
- **Descripción**: Crea un nuevo producto, persiste en SQL Server e invalida la clave de caché.
- **Cuerpo Request**:
  ```json
  {
    "name": "Teclado Mecánico",
    "sku": "KB-002",
    "description": "Switch Brown RGB",
    "price": 89.50,
    "stockQuantity": 50
  }
  ```
- **Respuesta 201 Created**: Objeto `ProductDto` creado.
- **Respuesta 400 Bad Request**: Errores de validación FluentValidation.
