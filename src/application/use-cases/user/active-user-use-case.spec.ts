import { describe, expect, it, beforeEach } from "vitest"
import { InMemoryUserRepository } from "../../../tests/repositories/in-memory-user-repository"
import { CreateUserUseCase } from "./create-user-use-case"
import { DisableUserUseCase } from "./disable-user-use-case"
import { ActiveUserUseCase } from "./active-user-use-case"
import { User, UserRole } from "@domain/user/entity/User"

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
    const actorResponse = await createUser.execute({
      name: "Secretaria",
      email: "secretaria@email.com",
      password: "123456",
      role: UserRole.SECRETARY,
    })

    const userResponse = await createUser.execute({
      name: "Caíque",
      email: "caique@email.com",
      password: "123456",
      role: UserRole.STUDENT,
    })

    if (actorResponse.isLeft()) {
      throw actorResponse.value
    }

    if (userResponse.isLeft()) {
      throw userResponse.value
    }

    const user = userResponse.value.user

    await disableUser.execute({
      email: "caique@email.com",
    })

    const response = await sut.execute({
      actor: actorResponse.value.user,
      userId: user.id,
    })

    expect(response.isRight()).toBe(true)

    if (response.isRight()) {
      expect(response.value.user.status).toBe("active")
    }
  })

  it("should not activate a non-existing user", async () => {
    const actorResponse = await createUser.execute({
      name: "Secretaria",
      email: "secretaria@email.com",
      password: "123456",
      role: UserRole.SECRETARY,
    })

    if (actorResponse.isLeft()) {
      throw actorResponse.value
    }

    const response = await sut.execute({
      actor: actorResponse.value.user,
      userId: "non-existing-user-id",
    })

    expect(response.isLeft()).toBe(true)
  })

  it("should not activate an already active user", async () => {
    const actorResponse = await createUser.execute({
      name: "Secretaria",
      email: "secretaria@email.com",
      password: "123456",
      role: UserRole.SECRETARY,
    })

    const userResponse = await createUser.execute({
      name: "Caíque",
      email: "caique@email.com",
      password: "123456",
      role: UserRole.STUDENT,
    })

    if (actorResponse.isLeft()) {
      throw actorResponse.value
    }

    if (userResponse.isLeft()) {
      throw userResponse.value
    }

    const response = await sut.execute({
      actor: actorResponse.value.user,
      userId: userResponse.value.user.id,
    })

    expect(response.isLeft()).toBe(true)
  })

  it("should not allow a student to activate a user", async () => {
    const actorResponse = await createUser.execute({
      name: "Aluno Actor",
      email: "actor@email.com",
      password: "123456",
      role: UserRole.STUDENT,
    })

    const userResponse = await createUser.execute({
      name: "Caíque",
      email: "caique@email.com",
      password: "123456",
      role: UserRole.STUDENT,
    })

    if (actorResponse.isLeft()) {
      throw actorResponse.value
    }

    if (userResponse.isLeft()) {
      throw userResponse.value
    }

    const response = await sut.execute({
      actor: actorResponse.value.user,
      userId: userResponse.value.user.id,
    })

    expect(response.isLeft()).toBe(true)
  })
})