import { Either, left, right } from "@/core/either"
import { Discipline } from "@/domain/discipline/entity/Discipline"
import { DisciplineRepository } from "@/domain/discipline/repository/discipline-repository"

interface GetDisciplineRequest {
  disciplineId: string
}

type GetDisciplineResponse = Either<
  Error,
  {
    discipline: Discipline
  }
>

export class GetDisciplineUseCase {
  constructor(
    private disciplineRepo: DisciplineRepository
  ) {}

  async execute({
    disciplineId
  }: GetDisciplineRequest): Promise<GetDisciplineResponse> {

    const discipline = await this.disciplineRepo.findById(disciplineId)

    if (!discipline) {
      return left(new Error("Disciplina não encontrada"))
    }

    return right({ discipline })
  }
}