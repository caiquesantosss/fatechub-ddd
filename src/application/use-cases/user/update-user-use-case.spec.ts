import { describe, expect, it } from "vitest"
import { InMemoryUserRepository } from "../../../tests/repositories/in-memory-user-repository"
import { CreateUserUseCase } from "./create-user-use-case"
import { UpdateUserUseCase } from "./update-user-use-case"
import { UserRole } from '@domain/user/entity/User'
import { beforeEach } from "vitest"

let repo: InMemoryUserRepository
let createUser: CreateUserUseCase
let sut: UpdateUserUseCase

describe("Update user", () => {
  beforeEach(() => {
    repo = new InMemoryUserRepository()
    createUser = new CreateUserUseCase(repo)
    sut = new UpdateUserUseCase(repo)
  })
  it("should be able to update a user name", async () => {
    await createUser.execute({
      name: "Caíque",
      email: "caique@email.com",
      password: "123456",
      role: UserRole.STUDENT, 
    })

    const updateUser = new UpdateUserUseCase(repo)

    const response = await updateUser.execute({
      email: "caique@email.com",
      name: "Novo Nome"
    })

    expect(response.isRight()).toBe(true)

    if (!response.isRight()) return

    expect(response.value.user.name).toBe("Novo Nome")
  })

  it("should not update a non-existing user", async () => {
    const response = await sut.execute({
      email: "naoexiste@email.com",
      name: "Teste"
    })

    expect(response.isLeft()).toBe(true)
  })
})