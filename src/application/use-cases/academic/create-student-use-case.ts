import { Either, left, right } from "../../../core/either"
import { Student } from "../../../domain/academic/entity/Student"
import { StudentRepository } from "../../../domain/academic/repository/student-repository"
import { UserRepository } from "@domain/user/repository/user-repository"
import { UserRole } from "@domain/user/entity/User"
import { RA } from "@domain/user/values-objects/register-academic"
import { randomUUID } from 'crypto'

interface CreateStudentRequest {
    userId: string
    ra: string
    courseId: string
}

type CreateStudentResponse = Either<
    Error,
    {
        student: Student
    }
>

export class CreateStudentUseCase {
    constructor(
        private userRepository: UserRepository,
        private studentRepository: StudentRepository
    ) { }

    async execute({
        userId,
        ra,
        courseId
    }: CreateStudentRequest): Promise<CreateStudentResponse> {

        let raVO: RA
        

        try {
            raVO = RA.create(ra)
        } catch (error) {
            return left(error as Error)
        }

        const user = await this.userRepository.findById(userId)

        if (!user) {
            return left(new Error("User not found"))
        }

        if (user.role !== UserRole.STUDENT) {
            return left(new Error("User is not a student"))
        }

        if (user.status !== "active") {
            return left(new Error("User is not active"))
        }

        const studentExists =
            await this.studentRepository.findByUserId(userId)

        if (studentExists) {
            return left(new Error("Student already exists"))
        }

        const raExists =
            await this.studentRepository.findByRA(raVO)

        if (raExists) {
            return left(new Error("RA already in use"))
        }

        const student = Student.create({
            id: randomUUID(),
            userId,
            ra: raVO,
            courseId
        })

        await this.studentRepository.create(student)

        return right({ student })
    }
}