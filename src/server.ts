import 'dotenv/config'
import fastify from 'fastify'
import { adminRoutes, authRoutes, userRoutes } from './routes/user-routes'
import { taskRoutes } from './routes/task-routes'
import jwt from '@fastify/jwt';

const app = fastify()

app.register(jwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key'
})

app.register(authRoutes)
app.register(userRoutes)
app.register(taskRoutes)
app.register(adminRoutes)

app.get('/', async () => {
  return { message: 'API Online com Prisma Postgres!' }
})

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('🚀 API Online com Prisma Postgres!')
})
