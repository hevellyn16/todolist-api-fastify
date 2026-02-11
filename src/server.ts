import 'dotenv/config'
import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import { PrismaPostgresAdapter } from '@prisma/adapter-ppg'

// Garantimos que a URL existe antes de criar o adapter
const url = process.env.DATABASE_URL

if (!url) {
  throw new Error("DATABASE_URL não encontrada no .env!")
}

const adapter = new PrismaPostgresAdapter({ connectionString: url })
const prisma = new PrismaClient({ adapter })

const app = fastify()

app.post('/users', async (request) => {
  const { name, email, password } = request.body as { name: string; email: string; password: string }
  return await prisma.user.create({
    data: { name, email, password },
  })
})

app.get('/users', async () => {
  return await prisma.user.findMany()
})

app.get('/tasks', async () => {
  return await prisma.task.findMany()
})

app.post('/tasks', async (request) => {
  const { title, userId } = request.body as { title: string; userId: string }
  return await prisma.task.create({
    data: { title, userId },
  })
})

app.get('/', async () => {
  return { message: 'API Online com Prisma Postgres!' }
})

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('🚀 API Online com Prisma Postgres!')
})