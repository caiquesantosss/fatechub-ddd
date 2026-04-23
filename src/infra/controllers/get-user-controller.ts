import { FastifyReply, FastifyRequest } from "fastify"
import { DrizzleUserRepository } from "../repositories/drizzle-user-repository"
import { GetUserUseCase } from "@/application/use-cases/user/get-user-use-case"

export class GetUserController {
    async handle(request: FastifyRequest, reply: FastifyReply) {
        const { email } = request.query as { email: string }

        const repo = new DrizzleUserRepository()
        const useCase = new GetUserUseCase(repo)

        const result = await useCase.execute({ email })

        if (result.isLeft()) {
            return reply.status(404).send({
                errro: result.value.message
            })
        }

        const user = result.value.user

        return reply.send({
            id: user.id, 
            name: user.name,
            email: user.email.getValue(), 
            role: user.role,
            status: user.status
        })
    }
}