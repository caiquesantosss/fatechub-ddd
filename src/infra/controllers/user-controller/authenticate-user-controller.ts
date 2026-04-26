import { AuthenticateUserUseCase } from "@/application/use-cases/user/authenticate-user-use-case";
import { DrizzleUserRepository } from "@/infra/repositories/drizzle-user-repository";
import { FastifyReply, FastifyRequest } from "fastify";

export class AuthenticateUserController {
    async handle(request: FastifyRequest, reply: FastifyReply) {
        const { email, password } = request.body as {
            email: string, 
            password: string 
        }

        const userRepository = new DrizzleUserRepository()
        const authenticateUser = new AuthenticateUserUseCase(userRepository)

        const result = await authenticateUser.execute({
            email, 
            password    
        })

        if (result.isLeft()) {
            return reply.status(401).send({
                error: result.value.message
            })
        }

        const user = result.value.user

        const token = await reply.jwtSign({
            sub: user.id, 
            role: user.role
        })

        return reply.status(200).send({
            token
        })
    }
}