import { Either, left, right } from "@/core/either"
import { CreateUserUseCase } from "../user/create-user-use-case"
import { CreateStudentUseCase } from "./create-student-use-case"
import { UserRole } from "@/domain/user/entity/User"

interface RegisterStudentUseCaseRequest {
    name: string
    email: string
    password: string
    ra: string
    courseId: string
}

type RegisterStudentUseCaseResponse = Either<
    Error,
    {
        userId: string,
        studentId: string
    }
>

export class RegisterStudentUseCase {
    constructor(
        private createUserUseCase: CreateUserUseCase,
        private createStudentUseCase: CreateStudentUseCase
    ) { }

    async execute(data: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {

        const userResult = await this.createUserUseCase.execute({
            name: data.name,
            email: data.email,
            password: data.password,
            role: UserRole.STUDENT
        })

        if (userResult.isLeft()) {
            return left(userResult.value)
        }

        const user = userResult.value.user

        const studentResult = await this.createStudentUseCase.execute({
            userId: user.id,
            ra: data.ra,
            courseId: data.courseId
        })

        if (studentResult.isLeft()) {
            return left(studentResult.value)
        }

        return right({
            userId: user.id,
            studentId: studentResult.value.student.id
        })
    }
}