import { describe, expect, it } from 'vitest'
import { InMemoryDisciplineRepository } from '@/tests/repositories/in-memory-discipline-repository'
import { CreateDisciplineUseCase } from './create-discipline-use-case'
import { GetDisciplineUseCase } from './get-discipline-use-case'
import { User, UserRole } from '@/domain/user/entity/User'
import { Email } from '@/domain/user/values-objects/email'
import { Password } from '@/domain/user/values-objects/password'

describe('Get Discipline Use Case', () => {
  it('should be able to get a discipline', async () => {
    const repo = new InMemoryDisciplineRepository()

    const createUseCase = new CreateDisciplineUseCase(repo)
    const getUseCase = new GetDisciplineUseCase(repo)

    const userOrError = User.create({
      name: "Coordenador",
      email: Email.create("coord@email.com"),
      password: Password.create("123456"),
      role: UserRole.COORDINATOR
    })

    if (userOrError.isLeft()) throw userOrError.value
    const user = userOrError.value

    const created = await createUseCase.execute({
      user,
      name: "Arquitetura de Software",
      courseId: "course-1"
    })

    if (created.isLeft()) throw created.value

    const disciplineId = created.value.discipline.id

    const response = await getUseCase.execute({
      disciplineId
    })

    expect(response.isRight()).toBe(true)

    if (response.isRight()) {
      expect(response.value.discipline.name).toBe("Arquitetura de Software")
    }
  })
})