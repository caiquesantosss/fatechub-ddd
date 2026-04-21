import { Either, left, right } from "@/core/either"
import { Discipline } from "@/domain/discipline/entity/Discipline"
import { DisciplineRepository } from "@/domain/discipline/repository/discipline-repository"
import { User, UserRole } from "@/domain/user/entity/User"

interface CreateDisciplineRequest {
  user: User
  name: string
  courseId: string
}

type CreateDisciplineResponse = Either<
  Error,
  {
    discipline: Discipline
  }
>

export class CreateDisciplineUseCase {
  constructor(
    private disciplineRepository: DisciplineRepository
  ) {}

  async execute({
    user,
    name,
    courseId
  }: CreateDisciplineRequest): Promise<CreateDisciplineResponse> {

    if (user.role !== UserRole.COORDINATOR) {
      return left(new Error("Apenas coordenadores podem criar disciplinas"))
    }

    const discipline = Discipline.create({
      name,
      courseId
    })

    const existing = await this.disciplineRepository.findByNameAndCourse(
        name, 
        courseId
    )

    if (existing) {
        return left(new Error("Disciplina já existe!"))
    }

    await this.disciplineRepository.create(discipline)

    return right({
      discipline
    })
  }
}