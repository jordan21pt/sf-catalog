import express from 'express'
import { NotFoundError } from '../error/not-found.error.js'
export const pageNotFoundMiddleware = (app: express.Express) => {
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    next(new NotFoundError('Página não encontrada  '))
  })
}
