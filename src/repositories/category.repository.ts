import { Category } from '@prisma/client'
import prisma from '../config/prisma.js'

export class CategoryRepository {
  async create(name: string, description?: string): Promise<Category> {
    return prisma.category.create({
      data: {
        name,
        description,
      },
    })
  }

  async findAll(): Promise<Category[]> {
    return prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: number): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id },
    })
  }

  async update(id: number, name?: string, description?: string): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data: {
        name,
        description,
        updatedAt: new Date(),
      },
    })
  }
}
