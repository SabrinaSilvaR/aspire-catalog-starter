export interface ProductDto {
  id: string
  name: string
  sku: string
  description: string
  price: number
  stockQuantity: number
  isActive: boolean
  createdAtUtc: string
}

export interface ListProductsResponse {
  items: ProductDto[]
  totalCount: number
  fromCache: boolean
}

export interface CreateProductRequest {
  name: string
  sku: string
  description: string
  price: number
  stockQuantity: number
}
