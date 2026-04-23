import { describe, expect, it, beforeEach } from "vitest"
import { InMemoryCourseRepository } from "@/tests/repositories/in-memory-course-repository"
import { CreateCourseUseCase } from "./create-course-use-case"
import { User, UserRole } from "@/domain/user/entity/User"
import { Email } from "@/domain/user/values-objects/email"
import { Password } from "@/domain/user/values-objects/password"

let repo: InMemoryCourseRepository
let sut: CreateCourseUseCase

describe("Create Course Use Case", () => {
  beforeEach(() => {
    repo = new InMemoryCourseRepository()
    sut = new CreateCourseUseCase(repo)
  })

  async function makeUser(role: UserRole) {
    const password = await Password.create("123456")

    const userOrError = User.create({
      name: role,
      email: Email.create(`${role}@email.com`),
      password,
      role
    })

    if (userOrError.isLeft()) throw userOrError.value

    return userOrError.value
  }

  it("should allow coordinator to create course", async () => {
    const user = await makeUser(UserRole.COORDINATOR)

    const response = await sut.execute({
      user,
      name: "ADS"
    })

    expect(response.isRight()).toBe(true)
    expect(repo.items.length).toBe(1)
  })

  it("should allow secretary to create course", async () => {
    const user = await makeUser(UserRole.SECRETARY)

    const response = await sut.execute({
      user,
      name: "Engenharia"
    })

    expect(response.isRight()).toBe(true)
  })

  it("should not allow student to create course", async () => {
    const user = await makeUser(UserRole.STUDENT)

    const response = await sut.execute({
      user,
      name: "ADS"
    })

    expect(response.isLeft()).toBe(true)
    expect(repo.items.length).toBe(0)
  })
})