import { Either, left, right } from "../../../core/either"
import { Professor } from "@domain/academic/entity/Professor"
import { ProfessorRepository } from "@domain/academic/repository/professor-repository"
import { UserRole } from "@domain/user/entity/User"
import { UserRepository } from "@domain/user/repository/user-repository"
import { CourseRepository } from "@/domain/course/repository/course-repository"

interface CreateProfessorRequest {
    userId: string
    courseIds: string[]
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
        private professorRepository: ProfessorRepository,
        private courseRepository: CourseRepository
    ) { }

    async execute({
        userId,
        courseIds,
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

        if (!courseIds.length) {
            return left(new Error("Professor deve estar vinculado a pelo menos um curso"))
        }

        const uniqueCourseIds = [...new Set(courseIds)]

        if (uniqueCourseIds.length !== courseIds.length) {
            return left(new Error("Cursos duplicados não são permitidos"))
        }

        for (const courseId of courseIds) {
            const course = await this.courseRepository.findById(courseId)

            if (!course) {
                return left(new Error(`Curso não encontrado: ${courseId}`))
            }
        }

        const professorExists = await this.professorRepository.findByUserId(userId)

        if (professorExists) {
            return left(new Error("Professor already exists"))
        }

        let professor: Professor

        try {
            professor = Professor.create({
                id: crypto.randomUUID(),
                userId,
                courseIds,
                department
            })
        } catch (error) {
            return left(error as Error)
        }

        await this.professorRepository.create(professor)

        return right({ professor })
    }
}