import { Either, left, right } from "@/core/either"
import { Discipline } from "@/domain/discipline/entity/Discipline"
import { DisciplineRepository } from "@/domain/discipline/repository/discipline-repository"

interface UpdateDisciplineRequest {
  disciplineId: string
  name?: string
  courseId?: string
}

type UpdateDisciplineResponse = Either<
  Error,
  {
    discipline: Discipline
  }
>

export class UpdateDisciplineUseCase {
  constructor(
    private disciplineRepository: DisciplineRepository
  ) {}

  async execute({
    disciplineId,
    name,
    courseId
  }: UpdateDisciplineRequest): Promise<UpdateDisciplineResponse> {

    const discipline = await this.disciplineRepository.findById(disciplineId)

    if (!discipline) {
      return left(new Error('Disciplina não encontrada!'))
    }

    if (name) {
      discipline.name = name
    }

    if (courseId) {
      discipline.courseId = courseId
    }

    await this.disciplineRepository.save(discipline)

    return right({
      discipline
    })
  }
}