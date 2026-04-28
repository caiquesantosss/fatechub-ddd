import { AssignProfessorToCourseUseCase } from "@/application/use-cases/course/assign-professor-to-course-use-case"
import { DrizzleCourseRepository } from "@/infra/repositories/drizzle-course-repository"
import { DrizzleProfessorRepository } from "@/infra/repositories/drizzle-professor-repository"
import { DrizzleUserRepository } from "@/infra/repositories/drizzle-user-repository"
import { FastifyReply, FastifyRequest } from "fastify"

export class AssignProfessorToCourseController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { professorId, courseId } = request.body as {
      professorId: string
      courseId: string
    }

    const userRepository = new DrizzleUserRepository()
    const professorRepository = new DrizzleProfessorRepository()
    const courseRepository = new DrizzleCourseRepository()

    const actorId = request.user.sub

    const actor = await userRepository.findById(actorId)

    if (!actor) {
      return reply.status(401).send({
        error: "Usuário não autenticado!"
      })
    }

    const assignProfessorToCourse = new AssignProfessorToCourseUseCase(
      professorRepository,
      courseRepository
    )

    const result = await assignProfessorToCourse.execute({
      actor,
      professorId,
      courseId
    })

    if (result.isLeft()) {
      return reply.status(400).send({
        error: result.value.message
      })
    }

    return reply.status(204).send()
  }
}