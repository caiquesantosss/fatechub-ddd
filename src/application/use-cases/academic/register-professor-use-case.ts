import { Either, left, right } from "@/core/either"
import { CreateUserUseCase } from "../user/create-user-use-case"
import { CreateProfessorUseCase } from "./create-professor-use-case"
import { User, UserRole } from "@/domain/user/entity/User"

interface RegisterProfessorRequest {
  actor: User
  name: string
  email: string
  password: string
  courseIds: string[]
  department?: string
}

type RegisterProfessorResponse = Either<
  Error,
  {
    userId: string
    professorId: string
  }
>

export class RegisterProfessorUseCase {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private createProfessorUseCase: CreateProfessorUseCase
  ) {}

  async execute(data: RegisterProfessorRequest): Promise<RegisterProfessorResponse> {
    if (
      data.actor.role !== UserRole.COORDINATOR &&
      data.actor.role !== UserRole.SECRETARY
    ) {
      return left(new Error("Apenas coordenação ou secretaria podem registrar professores"))
    }

    if (data.courseIds.length === 0) {
      return left(new Error("Professor deve estar vinculado a pelo menos um curso"))
    }

    const userResult = await this.createUserUseCase.execute({
      name: data.name,
      email: data.email,
      password: data.password,
      role: UserRole.PROFESSOR
    })

    if (userResult.isLeft()) {
      return left(userResult.value)
    }

    const user = userResult.value.user

    const professorResult = await this.createProfessorUseCase.execute({
      userId: user.id,
      courseIds: data.courseIds,
      department: data.department
    })

    if (professorResult.isLeft()) {
      return left(professorResult.value)
    }

    return right({
      userId: user.id,
      professorId: professorResult.value.professor.id
    })
  }
}