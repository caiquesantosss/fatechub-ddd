import { CreateStudentUseCase } from "@/application/use-cases/academic/create-student-use-case";
import { RegisterStudentUseCase } from "@/application/use-cases/academic/register-student-use-case";
import { CreateUserUseCase } from "@/application/use-cases/user/create-user-use-case";
import { DrizzleStudentRepository } from "@/infra/repositories/drizzle-student-repository";
import { DrizzleUserRepository } from "@/infra/repositories/drizzle-user-repository";
import { FastifyReply, FastifyRequest } from "fastify";

export class RegisterStudentController {
    async handle(request: FastifyRequest, reply: FastifyReply) {
        const { name, email, password, ra, courseId } = request.body as {
            name: string,
            email: string,
            password: string,
            ra: string,
            courseId: string
        }

        const userRepository = new DrizzleUserRepository()
        const studentRepository = new DrizzleStudentRepository()

        const actorId = request.user.sub

        const actor = await userRepository.findById(actorId)

        if (!actor) {
            return reply.status(401).send({
                error: 'Usuário não autenticado!'
            })
        }

        const createUser = new CreateUserUseCase(userRepository)
        const createStudent = new CreateStudentUseCase(
            userRepository,
            studentRepository
        )

        const registerStudent = new RegisterStudentUseCase(
            createUser,
            createStudent
        )

        const result = await registerStudent.execute({
            actor,
            name,
            email,
            password,
            ra,
            courseId
        })

        if (result.isLeft()) {
            return reply.status(400).send({
                error: result.value.message
            })
        }

        return reply.status(201).send(result.value)

    }
}