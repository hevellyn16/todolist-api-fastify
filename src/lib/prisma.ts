import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPostgresAdapter } from '@prisma/adapter-ppg'

const url = process.env.DATABASE_URL

if (!url) {
  throw new Error("DATABASE_URL não encontrada!")
}

const adapter = new PrismaPostgresAdapter({ connectionString: url })
export const prisma = new PrismaClient({ adapter })