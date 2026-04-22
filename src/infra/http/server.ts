import Fastify from 'fastify'
import { userRoutes } from './routes/user-routes'

export async function build() {
    const app = Fastify()

    app.get('/', async () => {
        return { message: 'API RODANDO!'}
    })

    app.register(userRoutes)

    return app
}