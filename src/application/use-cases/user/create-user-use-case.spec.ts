import { describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '../../../tests/repositories/in-memory-user-repository'
import { CreateUserUseCase } from './create-user-use-case'
import { UserRole } from '@domain/user/entity/User'
import { beforeEach } from 'vitest'

let repo: InMemoryUserRepository
let sut: CreateUserUseCase

describe('Create user use-case', () => {
    beforeEach(() => {
      repo = new InMemoryUserRepository() 
      sut = new CreateUserUseCase(repo)
    })

  it('should be able to create a user', async () => {

    const response = await sut.execute({
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
    expect(repo.items.length).toBe(1)
  })

  it('should not be able to create a user with an invalid e-mail', async () => {
    const response = await sut.execute({
      name: "Caíque",
      email: "caiqueemail.com",
      password: "123456",
      role: UserRole.STUDENT,
    })

    expect(response.isLeft()).toBe(true)
    expect(repo.items.length).toBe(0)
  })

  it('should not be able to create a user with short password', async () => {
    const response = await sut.execute({
      name: "Caíque",
      email: "caique@email.com",
      password: "123",
      role: UserRole.STUDENT,
    })

    expect(response.isLeft()).toBe(true)
    expect(repo.items.length).toBe(0)
  })
})