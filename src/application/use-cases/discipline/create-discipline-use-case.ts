import { Either, left, right } from "@/core/either"
import { Discipline } from "@/domain/discipline/entity/Discipline"
import { DisciplineRepository } from "@/domain/discipline/repository/discipline-repository"
import { ProfessorRepository } from "@/domain/academic/repository/professor-repository"
import { User, UserRole } from "@/domain/user/entity/User"

interface CreateDisciplineRequest {
  user: User
  name: string
  courseId: string
  professorId: string
}

type CreateDisciplineResponse = Either<
  Error,
  {
    discipline: Discipline
  }
>

export class CreateDisciplineUseCase {
  constructor(
    private disciplineRepository: DisciplineRepository,
    private professorRepository: ProfessorRepository
  ) {}

  async execute({
    user,
    name,
    courseId,
    professorId
  }: CreateDisciplineRequest): Promise<CreateDisciplineResponse> {

    if (user.role !== UserRole.COORDINATOR) {
      return left(new Error("Apenas coordenadores podem criar disciplinas"))
    }

    const professor = await this.professorRepository.findById(professorId)

    if (!professor) {
      return left(new Error("Professor não encontrado"))
    }

    const existing = await this.disciplineRepository.findByNameAndCourse(
      name,
      courseId
    )

    if (existing) {
      return left(new Error("Disciplina já existe!"))
    }

    const discipline = Discipline.create({
      name,
      courseId,
      professorId
    })

    await this.disciplineRepository.create(discipline)

    return right({ discipline })
  }
}