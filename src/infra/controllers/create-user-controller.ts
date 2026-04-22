import { FastifyRequest, FastifyReply } from "fastify"
import { DrizzleUserRepository } from "@/infra/repositories/drizzle-user-repository"
import { CreateUserUseCase } from "@/application/use-cases/user/create-user-use-case"
import { UserRole } from "@/domain/user/entity/User"

export class CreateUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { name, email, password, role } = request.body as any

    const repo = new DrizzleUserRepository()
    const useCase = new CreateUserUseCase(repo)

    const result = await useCase.execute({
      name,
      email,
      password,
      role: role as UserRole
    })

    if (result.isLeft()) {
      return reply.status(400).send({
        error: result.value.message
      })
    }

    return reply.status(201).send({
      id: result.value.user.id,
      name: result.value.user.name,
      email: result.value.user.email.getValue(),
      role: result.value.user.role
    })
  }
}