import Fastify from 'fastify'
import { userRoutes } from './routes/user-routes'
import fastifyJwt from '@fastify/jwt'
import { env } from '@/env/env'
import { courseRoutes } from './routes/course-routes'
import { studentRoutes } from './routes/student-routes'

export async function build() {
    const app = Fastify()

    app.get('/', async () => {
        return { message: 'API RODANDO!'}
    })
    app.register(fastifyJwt, {
        secret: env.JWT_SECRET
    })
    
    app.register(userRoutes)
    app.register(courseRoutes)
    app.register(studentRoutes)

    return app
}