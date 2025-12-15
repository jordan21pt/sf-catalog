import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

// Ensure local env file is respected even if .env was loaded earlier.
dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || '.env', override: true })

const isProd = process.env.NODE_ENV === 'production'

const dbHost = isProd ? process.env.SF_CATALOG_DB_HOST || 'sf-catalog-db' : 'localhost'
const dbPort = isProd
  ? process.env.SF_CATALOG_DB_PORT || '3306'
  : process.env.SF_CATALOG_DB_HOST_PORT || process.env.SF_CATALOG_DB_PORT || '3309'
const dbUser = process.env.SF_CATALOG_DB_USER || 'catalog_user'
const dbPass = encodeURIComponent(process.env.SF_CATALOG_DB_PASSWORD || 'p@ssw0rd')
const dbName = process.env.SF_CATALOG_DB_DATABASE || 'sf_catalog'

const shadowHost = isProd
  ? process.env.SF_CATALOG_DB_SHADOW_HOST || 'sf-catalog-db-shadow'
  : 'localhost'
const shadowPort = isProd
  ? process.env.SF_CATALOG_DB_PORT || '3306'
  : process.env.SF_CATALOG_DB_SHADOW_PORT || process.env.SF_CATALOG_DB_HOST_PORT || '5434'
const shadowDb = process.env.SF_CATALOG_SHADOW_DB_NAME || 'sf_catalog_shadow'

process.env.SF_CATALOG_DATABASE_URL =
  process.env.SF_CATALOG_DATABASE_URL ||
  `mysql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`

process.env.SF_CATALOG_SHADOW_DATABASE_URL =
  process.env.SF_CATALOG_SHADOW_DATABASE_URL ||
  `mysql://${dbUser}:${dbPass}@${shadowHost}:${shadowPort}/${shadowDb}`

export const prisma = new PrismaClient()

export default prisma
