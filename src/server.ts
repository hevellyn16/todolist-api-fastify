import { app } from './app'
import 'dotenv/config'
const port = Number(process.env.PORT) || 3333

app.get('/', async () => {
  return { message: 'API Online com Prisma Postgres!' }
})

app.listen({ 
  host: '0.0.0.0',
  port: port
}).then(() => {
  console.log(`🚀 API Online com Prisma Postgres! Porta: ${port}` )
})
