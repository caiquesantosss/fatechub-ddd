import { describe, expect, it } from "vitest"
import { InMemoryUserRepository } from "../../../tests/repositories/in-memory-user-repository"
import { CreateUserUseCase } from "./create-user-use-case"
import { UpdateUserUseCase } from "./update-user-use-case"
import { UserRole } from '@domain/user/entity/User'

describe("Update user", () => {
  it("should be able to update a user name", async () => {
    const repo = new InMemoryUserRepository()

    const createUser = new CreateUserUseCase(repo)

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
    const repo = new InMemoryUserRepository()

    const updateUser = new UpdateUserUseCase(repo)

    const response = await updateUser.execute({
      email: "naoexiste@email.com",
      name: "Teste"
    })

    expect(response.isLeft()).toBe(true)
  })
})