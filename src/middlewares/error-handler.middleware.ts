import express, { Request, Response } from 'express'
import { ValidationError } from '../error/validation.error.js'
import { InternalServerError } from '../error/internal-server.error.js'

export const errorHandlerMiddleware = (app: express.Express) => {
  app.use((error: Error, req: Request, res: Response) => {
    if (error instanceof ValidationError) {
      error.send(res)
    } else {
      new InternalServerError().send(res)
    }
  })
}
