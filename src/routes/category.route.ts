import { Router } from 'express'
import { CategoryController } from '../controllers/category.controller.js'

const router = Router()

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: List all categories
 *     responses:
 *       200:
 *         description: List of categories
 *   post:
 *     summary: Create a new category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created
 */

router.get('/', CategoryController.getAll)
router.get('/:id', CategoryController.getById)
router.post('/', CategoryController.save)
router.put('/:id', CategoryController.update)

export default router
