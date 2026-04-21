import { describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '../../../tests/repositories/in-memory-user-repository'
import { CreateUserUseCase } from './create-user-use-case'
import { UserRole } from '@domain/user/entity/User'

describe('Create user use-case', () => {
  it('should be able to create a user', async () => {
    const r = new InMemoryUserRepository()
    const useCase = new CreateUserUseCase(r)

    const response = await useCase.execute({
      name: "Caíque",
      email: "caique@email.com",
      password: "123456",
      role: UserRole.STUDENT,
    })

    expect(response.isRight()).toBe(true)

    if (!response.isRight()) return

    const user = response.value.user

    expect(user.email.getValue()).toBe("caique@email.com") 
    expect(user.name).toBe("Caíque")
    expect(r.items.length).toBe(1)
  })

  it('should not be able to create a user with an invalid e-mail', async () => {
    const r = new InMemoryUserRepository()
    const useCase = new CreateUserUseCase(r)

    const response = await useCase.execute({
      name: "Caíque",
      email: "caiqueemail.com",
      password: "123456",
      role: UserRole.STUDENT,
    })

    expect(response.isLeft()).toBe(true)
    expect(r.items.length).toBe(0)
  })

  it('should not be able to create a user with short password', async () => {
    const r = new InMemoryUserRepository()
    const useCase = new CreateUserUseCase(r)

    const response = await useCase.execute({
      name: "Caíque",
      email: "caique@email.com",
      password: "123",
      role: UserRole.STUDENT,
    })

    expect(response.isLeft()).toBe(true)
    expect(r.items.length).toBe(0)
  })
})