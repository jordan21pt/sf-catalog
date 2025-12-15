import { NextFunction, Request, Response } from 'express'
import { CategoryService } from '../services/category.service.js'
import { ValidationError } from '../error/validation.error.js'

const service = new CategoryService()

export class CategoryController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.listCategories()
      res.send(result)
    } catch (error) {
      next(error)
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.getCategory(parseInt(req.params.id))
      res.send(result)
    } catch (error) {
      next(error)
    }
  }

  static async save(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body
      if (!name) {
        throw new ValidationError('Name is a required field')
      }
      const result = await service.createCategory(name, description)
      res.status(201).send({
        id: result.id,
        message: `Category ${result.id} created successfully!`,
      })
    } catch (error) {
      next(error)
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body
      const categoryId = parseInt(req.params.id)
      const updatedCategory = await service.updateCategory(categoryId, name, description)
      res.send({
        message: 'Category updated successfully',
        id: updatedCategory.id,
      })
    } catch (error) {
      next(error)
    }
  }
}
