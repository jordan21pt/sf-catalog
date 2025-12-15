import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SF Catalog API',
      version: '1.0.0',
    },
    servers: [{ url: `http://localhost:${process.env.SF_CATALOG_API_PORT || 3003}` }],
  },
  apis: ['./src/**/*.ts', './dist/**/*.js'],
}

const specs = swaggerJsdoc(options)

export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs))
  app.get('/swagger.json', (_req, res) => res.json(specs))
}
