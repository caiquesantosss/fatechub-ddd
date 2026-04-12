import { describe, expect, it } from "vitest"
import { InMemoryUserRepository } from "../../../tests/repositories/in-memory-user/in-memory-user-repository"
import { CreateUserUseCase } from "./create-user-use-case"
import { DisableUserUseCase } from "./disable-user-use-case"
import { ActiveUserUseCase } from "./active-user-use-case"
import { UserRole } from "@domain/user/entity/User"

describe("Activate user", () => {
  it("should be able to activate a user", async () => {
    const repo = new InMemoryUserRepository()

    const createUser = new CreateUserUseCase(repo)

    await createUser.execute({
      name: "Caíque",
      email: "caique@email.com",
      password: "123456",
      role: UserRole.STUDENT,
    })

    const disableUser = new DisableUserUseCase(repo)

    await disableUser.execute({
      email: "caique@email.com"
    })

    const activateUser = new ActiveUserUseCase(repo)

    const response = await activateUser.execute({
      email: "caique@email.com"
    })

    expect(response.isRight()).toBe(true)

    if (!response.isRight()) return

    expect(response.value.user.status).toBe("active")
  })

  it("should not activate a non-existing user", async () => {
    const repo = new InMemoryUserRepository()

    const activateUser = new ActiveUserUseCase(repo)

    const response = await activateUser.execute({
      email: "naoexiste@email.com"
    })

    expect(response.isLeft()).toBe(true)
  })

  it("should not activate an already active user", async () => {
    const repo = new InMemoryUserRepository()

    const createUser = new CreateUserUseCase(repo)

    await createUser.execute({
      name: "Caíque",
      email: "caique@email.com",
      password: "123456",
      role: UserRole.STUDENT,
    })

    const activateUser = new ActiveUserUseCase(repo)

    const response = await activateUser.execute({
      email: "caique@email.com"
    })

    expect(response.isLeft()).toBe(true)
  })
})