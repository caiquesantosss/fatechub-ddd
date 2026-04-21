import { Either, left, right } from "@/core/either";
import { Enrollment } from "@/domain/discipline/entity/enrollment"
import { EnrollmentRepository } from "@/domain/discipline/repository/enrollment-repository";
import { User, UserRole } from "@/domain/user/entity/User"

interface EnrollStudentRequest {
    user: User
    studentId: string,
    disciplineId: string,
}

type EnrollStudentResponse = Either<
    Error,
    {
        enrollment: Enrollment
    }
>

export class EnrollStudentUseCase {
    constructor(
        private enrollmentRepository: EnrollmentRepository
    ) { }

    async execute({
        user,
        studentId,
        disciplineId
    }: EnrollStudentRequest): Promise<EnrollStudentResponse> {
        if (user.role !== UserRole.COORDINATOR) {
            return left(new Error('Apenas o coordenador pode matricular'))
        }

        const exists = await this.enrollmentRepository
            .findByStudentAndDiscipline(
                studentId,
                disciplineId
            )

        if (exists) {
            return left(new Error("Aluno já matriculado nessa disciplina"))
        }

        const enrollment = Enrollment.create({
            studentId,
            disciplineId
        })

        await this.enrollmentRepository.create(enrollment)

        return right({ enrollment })

    }
}