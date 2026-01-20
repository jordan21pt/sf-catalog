import { ProductRepository } from '../repositories/product.repository.js'
import { CategoryRepository } from '../repositories/category.repository.js'
import { NotFoundError } from '../error/not-found.error.js'
import { ValidationError } from '../error/validation.error.js'
import type { Product, Category } from '@prisma/client'

const repo = new ProductRepository()
const categoryRepo = new CategoryRepository()

export class ProductService {
  async createProduct(
    name: string,
    description: string,
    price: number,
    stock: number,
    categoryId: number
  ): Promise<Product> {
    const category: Category | null = await categoryRepo.findById(categoryId)
    if (!category) {
      throw new NotFoundError('Invalid category')
    }
    return repo.create(name, description, price, stock, categoryId)
  }

  async listProducts(): Promise<Product[]> {
    return repo.findAll()
  }

  async getProduct(id: number): Promise<Product> {
    console.log('dentro da get product', id)
    const product: Product | null = await repo.findById(id)
    
    if (!product) {
      throw new NotFoundError('Product not found')
    }
    console.log(product)
    return product
  }

  async updateProduct(
    id: number,
    name?: string,
    description?: string,
    price?: number,
    stock?: number,
    categoryId?: number
  ): Promise<Product> {
    const existing: Product | null = await repo.findById(id)
    if (!existing) {
      throw new NotFoundError('Product not found')
    }

    if (categoryId) {
      const category: Category | null = await categoryRepo.findById(categoryId)
      if (!category) {
        throw new NotFoundError('Invalid category')
      }
    }

    const updatedProduct = await repo.update(id, name, description, price, stock, categoryId)
    if (!updatedProduct) {
      throw new NotFoundError('Product not found after update')
    }

    return updatedProduct
  }

  async searchProducts(query: string): Promise<Product[]> {
    return repo.search(query)
  }

  async updateStock(id: number, quantity: number): Promise<Product> {
    const product: Product | null = await repo.findById(id)

    if (!product) {
      throw new NotFoundError('Product not found')
    }

    const newStock = product.stock - quantity

    if (newStock < 0) {
      throw new ValidationError('Insufficient stock. Operation would result in negative stock.')
    }

    const updatedProduct = await repo.update(id, undefined, undefined, newStock, undefined)

    if (!updatedProduct) {
      throw new Error('Failed to update product stock.')
    }

    return updatedProduct
  }
}
