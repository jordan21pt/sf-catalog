export interface ProductBase {
  id: number
  name: string
  sku: string
  price: number
  stock: number
  category_id: number
  created_at: Date
  updated_at: Date
}

export interface Product extends ProductBase {
  category_name: string
}
