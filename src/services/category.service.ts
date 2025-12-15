import { NotFoundError } from '../error/not-found.error.js'
import { CategoryRepository } from '../repositories/category.repository.js'
import { Category } from '@prisma/client'

const repo = new CategoryRepository()

export class CategoryService {
  async createCategory(name: string, description?: string): Promise<Category> {
    return repo.create(name, description)
  }

  async listCategories(): Promise<Category[]> {
    return repo.findAll()
  }

  async getCategory(id: number): Promise<Category> {
    const cat = await repo.findById(id)
    if (!cat) {
      throw new NotFoundError('Category not found')
    }
    return cat
  }

  async updateCategory(id: number, name?: string, description?: string): Promise<Category> {
    const cat = await repo.findById(id)
    if (!cat) {
      throw new NotFoundError('Category not found')
    }
    const updatedCat = await repo.update(id, name, description)
    if (!updatedCat) {
      throw new NotFoundError('Category not found after update')
    }
    return updatedCat
  }
}
