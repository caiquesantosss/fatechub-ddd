import { Either, left, right } from "@/core/either"
import { EnrollmentRepository } from "@/domain/discipline/repository/enrollment-repository"
import { GradeType } from "@/domain/discipline/values-objects/grade"

interface GetGradeRequest {
  enrollmentId: string
  type: GradeType
}

type GetGradeResponse = Either<
  Error,
  {
    value: number
  }
>

export class GetGradeUseCase {
  constructor(
    private enrollmentRepo: EnrollmentRepository
  ) {}

  async execute({
    enrollmentId,
    type
  }: GetGradeRequest): Promise<GetGradeResponse> {

    const enrollment = await this.enrollmentRepo.findById(enrollmentId)

    if (!enrollment) {
      return left(new Error("Matrícula não encontrada"))
    }

    try {
      const value = enrollment.getGrade(type)
      return right({ value })
    } catch (error) {
      return left(error as Error)
    }
  }
}