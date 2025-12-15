import { Product } from '@prisma/client'
import prisma from '../config/prisma.js'

export class ProductRepository {
  async create(
    name: string,
    description: string,
    price: number,
    stock: number,
    categoryId: number
  ): Promise<Product> {
    return prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        categoryId,
      },
    })
  }

  async findAll(): Promise<Product[]> {
    return prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: number): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
    })
  }

  async update(
    id: number,
    name?: string,
    description?: string,
    price?: number,
    stock?: number,
    categoryId?: number
  ): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        stock,
        categoryId,
      },
    })
  }

  async search(query: string): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        OR: [{ name: { contains: query } }],
      },
    })
  }
}
