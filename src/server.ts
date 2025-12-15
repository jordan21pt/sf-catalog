import dotenv from 'dotenv'

// Load env vars before other imports so Prisma picks up the right file (env.local/env.docker).
dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || '.env', override: true })
const svc = 'sf-catalog'
const origLog = console.log
const origError = console.error
console.log = (...args) => origLog(`[${svc}]`, ...args)
console.error = (...args) => origError(`[${svc}]`, ...args)

import app from './routes/index.js'
import { pageNotFoundMiddleware } from './middlewares/page-not-found.middleware.js'
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware.js'
const PORT = process.env.SF_CATALOG_API_PORT || process.env.PORT || 3003

pageNotFoundMiddleware(app)
errorHandlerMiddleware(app)

app.listen(PORT, () => {
  console.log(`Service running on port ${PORT}`)
})
