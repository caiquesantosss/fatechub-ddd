import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryDisciplineRepository } from '@/tests/repositories/in-memory-discipline-repository'
import { InMemoryProfessorRepository } from '@/tests/repositories/in-memory-professor-repository'
import { CreateDisciplineUseCase } from './create-discipline-use-case'
import { GetDisciplineUseCase } from './get-discipline-use-case'
import { Professor } from '@/domain/academic/entity/Professor'
import { User, UserRole } from '@/domain/user/entity/User'
import { Email } from '@/domain/user/values-objects/email'
import { Password } from '@/domain/user/values-objects/password'

let disciplineRepo: InMemoryDisciplineRepository
let professorRepo: InMemoryProfessorRepository
let createDisciplineUseCase: CreateDisciplineUseCase
let sut: GetDisciplineUseCase

describe('Get Discipline Use Case', () => {
  beforeEach(() => {
    disciplineRepo = new InMemoryDisciplineRepository()
    professorRepo = new InMemoryProfessorRepository()

    createDisciplineUseCase = new CreateDisciplineUseCase(
      disciplineRepo,
      professorRepo
    )

    sut = new GetDisciplineUseCase(disciplineRepo)
  })

  it('should be able to get a discipline', async () => {
    const professor = Professor.create({
      id: 'prof-1',
      userId: 'user-prof-1',
      department: 'Tecnologia'
    })

    await professorRepo.create(professor)

    const password = await Password.create('123456')

    const userOrError = User.create({
      name: 'Coordenador',
      email: Email.create('coord@email.com'),
      password,
      role: UserRole.COORDINATOR
    })

    if (userOrError.isLeft()) throw userOrError.value

    const user = userOrError.value

    const created = await createDisciplineUseCase.execute({
      user,
      name: 'Arquitetura de Software',
      courseId: 'course-1',
      professorId: professor.id
    })

    if (created.isLeft()) throw created.value

    const result = await sut.execute({
      disciplineId: created.value.discipline.id
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.discipline.name).toBe('Arquitetura de Software')
      expect(result.value.discipline.courseId).toBe('course-1')
      expect(result.value.discipline.professorId).toBe(professor.id)
    }
  })

  it('should not get a non-existing discipline', async () => {
    const result = await sut.execute({
      disciplineId: 'non-existing-id'
    })

    expect(result.isLeft()).toBe(true)
  })
})