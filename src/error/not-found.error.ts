import { ErrorBase } from './base.error.js'

export class NotFoundError extends ErrorBase {
  constructor(message = 'Not Found') {
    super(404, message)
  }
}
