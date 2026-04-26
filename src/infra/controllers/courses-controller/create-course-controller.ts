import { CreateCourseUseCase } from "@/application/use-cases/course/create-course-use-case"
import { DrizzleCourseRepository } from "@/infra/repositories/drizzle-course-repository"
import { DrizzleUserRepository } from "@/infra/repositories/drizzle-user-repository"
import { FastifyReply, FastifyRequest } from "fastify"

export class CreateCourseController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { name } = request.body as {
      name: string
    }

    const userRepository = new DrizzleUserRepository()
    const courseRepository = new DrizzleCourseRepository()

    const userId = request.user.sub

    const user = await userRepository.findById(userId)

    if (!user) {
      return reply.status(401).send({
        error: "Usuário não autenticado"
      })
    }

    const createCourseUseCase = new CreateCourseUseCase(courseRepository)

    const result = await createCourseUseCase.execute({
      user,
      name
    })

    if (result.isLeft()) {
      return reply.status(400).send({
        error: result.value.message
      })
    }

    return reply.status(201).send({
      id: result.value.course.id,
      name: result.value.course.name
    })
  }
}