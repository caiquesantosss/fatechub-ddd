import { FastifyInstance } from "fastify"
import { CreateUserController } from "../../controllers/create-user-controller"

export async function userRoutes(app: FastifyInstance) {
    const controller = new CreateUserController()

    app.post("/users", controller.handle)
}