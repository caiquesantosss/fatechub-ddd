import { describe, it, expect, beforeEach } from "vitest"
import { AddGradeUseCase } from "@/application/use-cases/discipline/add-the-grade-use-case"
import { InMemoryEnrollmentRepository } from "@/tests/repositories/in-memory-enrollment-repository"
import { Enrollment } from "@/domain/discipline/entity/enrollment"
import { User, UserRole } from "@/domain/user/entity/User"
import { Email } from "@/domain/user/values-objects/email"
import { Password } from "@/domain/user/values-objects/password"

let enrollmentRepo: InMemoryEnrollmentRepository
let sut: AddGradeUseCase

describe("Add Grade Use Case", () => {
  beforeEach(() => {
    enrollmentRepo = new InMemoryEnrollmentRepository()
    sut = new AddGradeUseCase(enrollmentRepo)
  })

  it("should be able to add a grade", async () => {
    const enrollment = Enrollment.create({
      studentId: "student-1",
      disciplineId: "disc-1"
    })

    await enrollmentRepo.create(enrollment)

    const userOrError = User.create({
      name: "Professor",
      email: Email.create("prof@email.com"),
      password: Password.create("123456"),
      role: UserRole.PROFESSOR
    })

    if (userOrError.isLeft()) throw userOrError.value
    const user = userOrError.value

    const result = await sut.execute({
      user,
      enrollmentId: enrollment.id,
      type: "B1",
      value: 8
    })

    expect(result.isRight()).toBe(true)
    expect(enrollmentRepo.items[0].grades).toHaveLength(1)
  })

  it("should not allow duplicate grade type", async () => {
    const enrollment = Enrollment.create({
      studentId: "student-1",
      disciplineId: "disc-1"
    })

    enrollment.addGrade({
      type: "B1",
      value: 7
    } as any)

    await enrollmentRepo.create(enrollment)

    const userOrError = User.create({
      name: "Professor",
      email: Email.create("prof@email.com"),
      password: Password.create("123456"),
      role: UserRole.PROFESSOR
    })

    if (userOrError.isLeft()) throw userOrError.value
    const user = userOrError.value

    const result = await sut.execute({
      user,
      enrollmentId: enrollment.id,
      type: "B1",
      value: 9
    })

    expect(result.isLeft()).toBe(true)
  })

  it("should not allow unauthorized user", async () => {
    const enrollment = Enrollment.create({
      studentId: "student-1",
      disciplineId: "disc-1"
    })

    await enrollmentRepo.create(enrollment)

    const userOrError = User.create({
      name: "Aluno",
      email: Email.create("aluno@email.com"),
      password: Password.create("123456"),
      role: UserRole.STUDENT
    })

    if (userOrError.isLeft()) throw userOrError.value
    const user = userOrError.value

    const result = await sut.execute({
      user,
      enrollmentId: enrollment.id,
      type: "B1",
      value: 10
    })

    expect(result.isLeft()).toBe(true)
  })
})