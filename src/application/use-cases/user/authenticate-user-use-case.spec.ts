import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryUserRepository } from '../../../tests/repositories/in-memory-user-repository'
import { CreateUserUseCase } from './create-user-use-case'
import { AuthenticateUserUseCase } from './authenticate-user-use-case'
import { UserRole } from '@domain/user/entity/User'

let repo: InMemoryUserRepository
let createUser: CreateUserUseCase
let sut: AuthenticateUserUseCase

describe('Authenticate User', () => {
  beforeEach(() => {
    repo = new InMemoryUserRepository()
    createUser = new CreateUserUseCase(repo)
    sut = new AuthenticateUserUseCase(repo)
  })

  it('should be able to authenticate the user', async () => {
    await createUser.execute({
      name: "Caíque",
      email: "caique@email.com",
      password: "123456",
      role: UserRole.STUDENT,
    })

    const response = await sut.execute({
      email: "caique@email.com",
      password: "123456"
    })

    expect(response.isRight()).toBe(true)

    if (response.isRight()) {
      expect(response.value.user.email.getValue()).toBe("caique@email.com")
    }
  })

  it('should not authenticate with wrong password', async () => {
    await createUser.execute({
      name: "Caíque",
      email: "caique@email.com",
      password: "123456",
      role: UserRole.STUDENT,
    })

    const response = await sut.execute({
      email: "caique@email.com",
      password: "senha-errada"
    })

    expect(response.isLeft()).toBe(true)
  })

  it('should not authenticate non-existing user', async () => {
    const response = await sut.execute({
      email: "naoexiste@email.com",
      password: "123456"
    })

    expect(response.isLeft()).toBe(true)
  })
})