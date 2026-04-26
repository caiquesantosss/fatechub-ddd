import { FastifyInstance } from "fastify"
import { CreateUserController } from "../../controllers/user-controller/create-user-controller"
import { GetUserController } from "@/infra/controllers/user-controller/get-user-controller"
import { AuthenticateUserController } from "@/infra/controllers/user-controller/authenticate-user-controller"

export async function userRoutes(app: FastifyInstance) {
    const cCreateUser = new CreateUserController()
    const cGetUser = new GetUserController()
    const cAuthenticate = new AuthenticateUserController

    app.post("/users", cCreateUser.handle)
    app.get("/users", cGetUser.handle)

    app.post("/session", cAuthenticate.handle)

}