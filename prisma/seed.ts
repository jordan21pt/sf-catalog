import { faker } from '@faker-js/faker'
import prisma from '../src/config/prisma.js'

async function seed(categoriesCount: number, productsCount: number) {
  console.log('Starting seed...')

  try {
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()

    const createdCategories = await Promise.all(
      Array.from({ length: categoriesCount }).map(() =>
        prisma.category.create({
          data: {
            name: faker.commerce.department(),
            description: faker.commerce.productDescription(),
          },
        })
      )
    )

    const productsData = Array.from({ length: productsCount }).map(() => {
      const category = faker.helpers.arrayElement(createdCategories)
      return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.number.float({ min: 5, max: 50, fractionDigits: 2 }),
        stock: faker.number.int({ min: 0, max: 100 }),
        categoryId: category.id,
      }
    })

    await prisma.product.createMany({ data: productsData })

    console.log('Seed completed successfully!')
  } catch (err) {
    console.error('Error executing seed:', err)
  } finally {
    await prisma.$disconnect()
  }
}

const args = process.argv.slice(2)
const categoriesCount = parseInt(args[0], 10) || 5
const productsCount = parseInt(args[1], 10) || 30

seed(categoriesCount, productsCount)
