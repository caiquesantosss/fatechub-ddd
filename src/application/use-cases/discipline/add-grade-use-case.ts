import { Either, left, right } from "@/core/either"
import { EnrollmentRepository } from "@/domain/discipline/repository/enrollment-repository"
import { User, UserRole } from "@/domain/user/entity/User"
import { Grade, GradeType } from "@/domain/discipline/values-objects/grade"

interface AddGradeRequest {
  user: User
  enrollmentId: string
  type: GradeType
  value: number
}

type AddGradeResponse = Either<Error, null>

export class AddGradeUseCase {
  constructor(
    private enrollmentRepo: EnrollmentRepository
  ) {}

  async execute({
    user,
    enrollmentId,
    type,
    value
  }: AddGradeRequest): Promise<AddGradeResponse> {

    if (
      user.role !== UserRole.PROFESSOR &&
      user.role !== UserRole.COORDINATOR
    ) {
      return left(new Error("Sem permissão para lançar nota"))
    }

    const enrollment = await this.enrollmentRepo.findById(enrollmentId)

    if (!enrollment) {
      return left(new Error("Matrícula não encontrada"))
    }

    let grade: Grade

    try {
      grade = Grade.create(type, value)
    } catch (error) {
      return left(error as Error)
    }

    try {
      enrollment.addGrade(grade)
    } catch (error) {
      return left(error as Error)
    }

    await this.enrollmentRepo.save(enrollment)

    return right(null)
  }
}