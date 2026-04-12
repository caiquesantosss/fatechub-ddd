import { Either, left, right } from "../../../core/either"
import { Professor } from "@domain/academic/entity/Professor"
import { ProfessorRepository } from "@domain/academic/repository/professor-repository"
import { UserRole } from "@domain/user/entity/User"
import { UserRepository } from "@domain/user/repository/user-repository"

interface CreateProfessorRequest {
    userId: string
    department?: string
}

type CreateProfessorResponse = Either<
    Error,
    {
        professor: Professor
    }
>

export class CreateProfessorUseCase {
    constructor(
        private userRepository: UserRepository,
        private professorRepository: ProfessorRepository
    ) { }

    async execute({
        userId,
        department
    }: CreateProfessorRequest): Promise<CreateProfessorResponse> {
        const user = await this.userRepository.findById(userId)

        if (!user) {
            return left(new Error("User not found"))
        }

        if (user.role !== UserRole.PROFESSOR) {
            return left(new Error("User is not a professor"))
        }

        if (user.status !== "active") {
            return left(new Error("User is not active"))
        }

        const professorExists =
            await this.professorRepository.findByUserId(userId)

        if (professorExists) {
            return left(new Error("Professor already exists"))
        }

        const professor = Professor.create({
            id: crypto.randomUUID(),
            userId,
            department
        })

        await this.professorRepository.create(professor)

        return right({ professor })
    }

}