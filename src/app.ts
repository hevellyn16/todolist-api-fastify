import 'dotenv/config'
import fastify from 'fastify'
import { authRoutes, userRoutes } from './routes/user-routes'
import { adminRoutes } from './routes/admin-routes'
import { taskRoutes } from './routes/task-routes'
import jwt from '@fastify/jwt';
import { errorHandler } from './error-handle';
import {fastifySwagger} from '@fastify/swagger';
import {fastifySwaggerUi} from '@fastify/swagger-ui';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import cors from '@fastify/cors';

export const app = fastify()

app.register(cors, {
    origin:true, // Permitir todas as origens
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permitir métodos HTTP específicos
    allowedHeaders: ['Content-Type', 'Authorization'], // Permitir cabeçalhos específicos
    credentials: true, // Permitir envio de cookies e credenciais
})

const secret = process.env.JWT_SECRET;
if (!secret) {
    console.error("JWT_SECRET is not defined in the environment variables.");
    process.exit(1);
}

app.setErrorHandler(errorHandler)

app.register(jwt, {
    secret: secret 
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'ToDo List API',
            description: 'API para gerenciamento de tarefas com autenticação JWT e controle de acesso baseado em funções (RBAC)',
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                },
            },
        },
    },
    transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
})

app.register(authRoutes)
app.register(userRoutes)
app.register(taskRoutes)
app.register(adminRoutes)