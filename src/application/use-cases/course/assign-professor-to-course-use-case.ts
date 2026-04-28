import { Either, left, right } from "@/core/either"
import { ProfessorRepository } from "@/domain/academic/repository/professor-repository"
import { CourseRepository } from "@/domain/course/repository/course-repository"
import { User, UserRole } from "@/domain/user/entity/User"

interface AssignProfessorToCourseRequest {
  actor: User
  professorId: string
  courseId: string
}

type AssignProfessorToCourseResponse = Either<Error, null>

export class AssignProfessorToCourseUseCase {
  constructor(
    private professorRepository: ProfessorRepository,
    private courseRepository: CourseRepository
  ) {}

  async execute({
    actor,
    professorId,
    courseId
  }: AssignProfessorToCourseRequest): Promise<AssignProfessorToCourseResponse> {

    if (
      actor.role !== UserRole.COORDINATOR &&
      actor.role !== UserRole.SECRETARY
    ) {
      return left(new Error("Apenas coordenação ou secretaria podem vincular professor ao curso"))
    }

    const professor = await this.professorRepository.findById(professorId)

    if (!professor) {
      return left(new Error("Professor não encontrado"))
    }

    const course = await this.courseRepository.findById(courseId)

    if (!course) {
      return left(new Error("Curso não encontrado"))
    }

    if (professor.courseIds.includes(courseId)) {
      return left(new Error("Professor já está nesse curso"))
    }

    await this.professorRepository.addCourse(professorId, courseId)

    return right(null)
  }
}