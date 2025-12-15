import { NextFunction, Request, Response } from 'express'
import { ProductService } from '../services/product.service.js'
import { ValidationError } from '../error/validation.error.js'

const service = new ProductService()

export class ProductController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.listProducts()
      res.send(result)
    } catch (error) {
      next(error)
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10)
      const result = await service.getProduct(id)
      res.send(result)
    } catch (error) {
      next(error)
    }
  }

  static async save(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, price, stock, categoryId } = req.body

      if (!name || !price || !categoryId) {
        throw new ValidationError('Name, price, and categoryId are required fields')
      }

      const result = await service.createProduct(
        name,
        description,
        Number(price),
        Number(stock ?? 0),
        parseInt(categoryId, 10)
      )

      res.status(201).json({
        data: result,
        message: `Product ${result.id} created successfully!`,
      })
    } catch (error) {
      next(error)
    }
  }

  static async searchProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { q } = req.query
      const queryValue = q ? String(q) : ''
      const result = await service.searchProducts(queryValue)
      res.send(result)
    } catch (error) {
      next(error)
    }
  }

  static async updateStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { quantity } = req.body
      const productId = parseInt(req.params.id, 10)

      if (quantity === undefined || isNaN(Number(quantity))) {
        throw new ValidationError(
          "A valid 'quantity' (e.g., 5 or -3) is required for stock update."
        )
      }

      const updatedProduct = await service.updateStock(productId, Number(quantity))

      res.send({
        message: 'Product stock updated successfully',
        id: updatedProduct.id,
        newStock: updatedProduct.stock,
      })
    } catch (error) {
      next(error)
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, price, stock, categoryId } = req.body

      const numPrice = price !== undefined ? Number(price) : undefined
      const numStock = stock !== undefined ? Number(stock) : undefined

      await service.updateProduct(
        parseInt(req.params.id, 10),
        name,
        description,
        numPrice,
        numStock,
        categoryId ? parseInt(categoryId, 10) : undefined
      )

      res.send({ message: 'Product updated successfully' })
    } catch (error) {
      next(error)
    }
  }
}
