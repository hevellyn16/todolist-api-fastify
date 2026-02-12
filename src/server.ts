import { app } from './app'

app.get('/', async () => {
  return { message: 'API Online com Prisma Postgres!' }
})

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('🚀 API Online com Prisma Postgres!')
})
