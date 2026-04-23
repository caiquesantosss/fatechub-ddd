import { describe, expect, it, beforeEach } from "vitest"
import { InMemoryUserRepository } from "../../../tests/repositories/in-memory-user-repository"
import { CreateUserUseCase } from "./create-user-use-case"
import { DisableUserUseCase } from "./disable-user-use-case"
import { ActiveUserUseCase } from "./active-user-use-case"
import { UserRole } from "@domain/user/entity/User"

let repo: InMemoryUserRepository
let createUser: CreateUserUseCase
let disableUser: DisableUserUseCase
let sut: ActiveUserUseCase

describe("Activate user", () => {
  beforeEach(() => {
    repo = new InMemoryUserRepository()

    createUser = new CreateUserUseCase(repo)
    disableUser = new DisableUserUseCase(repo)
    sut = new ActiveUserUseCase(repo)
  })

  it("should be able to activate a user", async () => {
    await createUser.execute({
      name: "Caíque",
      email: "caique@email.com",
      password: "123456",
      role: UserRole.STUDENT,
    })

    await disableUser.execute({
      email: "caique@email.com"
    })

    const response = await sut.execute({
      email: "caique@email.com"
    })

    expect(response.isRight()).toBe(true)

    if (response.isRight()) {
      expect(response.value.user.status).toBe("active")
    }
  })

  it("should not activate a non-existing user", async () => {
    const response = await sut.execute({
      email: "naoexiste@email.com"
    })

    expect(response.isLeft()).toBe(true)
  })

  it("should not activate an already active user", async () => {
    await createUser.execute({
      name: "Caíque",
      email: "caique@email.com",
      password: "123456",
      role: UserRole.STUDENT,
    })

    const response = await sut.execute({
      email: "caique@email.com"
    })

    expect(response.isLeft()).toBe(true)
  })
})