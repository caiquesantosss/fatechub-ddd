import { FastifyInstance } from "fastify"
import { CreateUserController } from "../../controllers/create-user-controller"
import { GetUserController } from "@/infra/controllers/get-user-controller"

export async function userRoutes(app: FastifyInstance) {
    const cCreateUser = new CreateUserController()
    const cGetUser = new GetUserController()

    app.post("/users", cCreateUser.handle)
    app.get("/users", cGetUser.handle)

}