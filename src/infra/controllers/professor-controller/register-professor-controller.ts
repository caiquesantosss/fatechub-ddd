import { CreateProfessorUseCase } from "@/application/use-cases/academic/create-professor-use-case";
import { RegisterProfessorUseCase } from "@/application/use-cases/academic/register-professor-use-case";
import { CreateUserUseCase } from "@/application/use-cases/user/create-user-use-case";
import { DrizzleCourseRepository } from "@/infra/repositories/drizzle-course-repository";
import { DrizzleProfessorRepository } from "@/infra/repositories/drizzle-professor-repository";
import { DrizzleUserRepository } from "@/infra/repositories/drizzle-user-repository";
import { FastifyReply, FastifyRequest } from "fastify";

export class RegisterProfessorController {
    async handle(request: FastifyRequest, reply: FastifyReply) {
        const { name, email, password, courseIds, department } = request.body as {
            name: string,
            email: string,
            password: string,
            courseIds: string[],
            department?: string
        }

        const userRepository = new DrizzleUserRepository()
        const professorRepository = new DrizzleProfessorRepository()
        const courseRepository = new DrizzleCourseRepository()

        const actorId = request.user.sub

        const actor = await userRepository.findById(actorId)

        if (!actor) {
            return reply.status(401).send({
                error: 'Usuário não autenticado!'
            })
        }

        const createUser = new CreateUserUseCase(userRepository)
        const createProfessor = new CreateProfessorUseCase(
            userRepository,
            professorRepository, 
            courseRepository
        )

        const registerStudent = new RegisterProfessorUseCase(
            createUser,
            createProfessor
        )

        const result = await registerStudent.execute({
            actor,
            name,
            email,
            password,
            courseIds, 
            department
        })

        if (result.isLeft()) {
            return reply.status(400).send({
                error: result.value.message
            })
        }

        return reply.status(201).send(result.value)

    }
}