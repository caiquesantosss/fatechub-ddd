import { describe, it, expect, beforeEach } from "vitest"
import { CreateRequestUseCase } from "@application/use-cases/secretariat/create-request-use-case"
import { InMemoryRequestRepository } from "../../../tests/repositories/in-memory-secretariat/in-memory-request-repository"
import { User, UserRole } from "@/domain/user/entity/User"
import { Email } from "@/domain/user/values-objects/email"
import { Password } from "@/domain/user/values-objects/password"

let requestRepo: InMemoryRequestRepository
let sut: CreateRequestUseCase

describe("Create Request Use Case", () => {
  beforeEach(() => {
    requestRepo = new InMemoryRequestRepository()
    sut = new CreateRequestUseCase(requestRepo)
  })

  it("should be able to create a request", async () => {
    const userOrError = User.create({
      name: "João",
      email: Email.create("joao@email.com"),
      password: Password.create("123456"),
      role: UserRole.STUDENT
    })

    if (userOrError.isLeft()) {
      throw userOrError.value
    }

    const user = userOrError.value

    const result = await sut.execute({
      user,
      documentId: "doc-1"
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(requestRepo.items).toHaveLength(1)
      expect(requestRepo.items[0].status).toBe("pendente")
      expect(result.value.request.studentId).toBe(user.id)
    }
  })

  it("should not allow non-student to create request", async () => {
    const userOrError = User.create({
      name: "Maria",
      email: Email.create("maria@email.com"),
      password: Password.create("123456"),
      role: UserRole.SECRETARY
    })

    if (userOrError.isLeft()) {
      throw userOrError.value
    }

    const user = userOrError.value

    const result = await sut.execute({
      user,
      documentId: "doc-1"
    })

    expect(result.isLeft()).toBe(true)
  })
})