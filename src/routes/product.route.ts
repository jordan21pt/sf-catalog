import { Router } from 'express'
import { ProductController } from '../controllers/product.controller.js'

const router = Router()
/**
 * @swagger
 * /products:
 *   get:
 *     summary: List all products
 *     responses:
 *       200:
 *         description: List of products
 *   post:
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               sku:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Product created
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 *   put:
 *     summary: Update product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Search products by name
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of filtered products
 */

/**
 * @swagger
 * /products/{id}/stock:
 *   patch:
 *     summary: Update stock of a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Stock updated
 *       404:
 *         description: Product not found
 */
router.get('/', ProductController.getAll)
router.get('/search', ProductController.searchProducts)
router.get('/:id', ProductController.getById)
router.post('/', ProductController.save)
router.put('/:id', ProductController.update)
router.patch('/:id/stock', ProductController.updateStock)

export default router
