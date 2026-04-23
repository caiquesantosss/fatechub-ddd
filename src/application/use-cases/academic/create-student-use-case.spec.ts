import { describe, expect, it, beforeEach } from "vitest"
import { InMemoryUserRepository } from "../../../tests/repositories/in-memory-user-repository"
import { InMemoryStudentRepository } from "../../../tests/repositories/in-memory-student-repository"
import { CreateStudentUseCase } from "./create-student-use-case"
import { CreateUserUseCase } from "../user/create-user-use-case"
import { UserRole } from "@domain/user/entity/User"

let userRepo: InMemoryUserRepository
let studentRepo: InMemoryStudentRepository
let createUser: CreateUserUseCase
let sut: CreateStudentUseCase

describe("Create student use-case", () => {
  beforeEach(() => {
    userRepo = new InMemoryUserRepository()
    studentRepo = new InMemoryStudentRepository()

    createUser = new CreateUserUseCase(userRepo)
    sut = new CreateStudentUseCase(userRepo, studentRepo)
  })

  it("should be able to create a student", async () => {
    const userResponse = await createUser.execute({
      name: "Caíque",
      email: "caique@email.com",
      password: "123456",
      role: UserRole.STUDENT,
    })

    expect(userResponse.isRight()).toBe(true)
    if (!userResponse.isRight()) return

    const user = userResponse.value.user

    const studentResponse = await sut.execute({
      userId: user.id,
      ra: "12345678",
      courseId: "course-1",
    })

    expect(studentResponse.isRight()).toBe(true)
    if (!studentResponse.isRight()) return

    const student = studentResponse.value.student

    expect(student.userId).toBe(user.id)
    expect(studentRepo.items.length).toBe(1)
  })

  it("should not create student if user does not exist", async () => {
    const response = await sut.execute({
      userId: "fake-id",
      ra: "123456",
      courseId: "course-1",
    })

    expect(response.isLeft()).toBe(true)
    expect(studentRepo.items.length).toBe(0)
  })

  it("should not create student if user is not student role", async () => {
    const userResponse = await createUser.execute({
      name: "Caíque",
      email: "caique@email.com",
      password: "123456",
      role: UserRole.PROFESSOR,
    })

    if (!userResponse.isRight()) return

    const user = userResponse.value.user

    const response = await sut.execute({
      userId: user.id,
      ra: "123456",
      courseId: "course-1",
    })

    expect(response.isLeft()).toBe(true)
    expect(studentRepo.items.length).toBe(0)
  })

  it("should not allow duplicate RA", async () => {
    const user1 = await createUser.execute({
      name: "User 1",
      email: "user1@email.com",
      password: "123456",
      role: UserRole.STUDENT,
    })

    const user2 = await createUser.execute({
      name: "User 2",
      email: "user2@email.com",
      password: "123456",
      role: UserRole.STUDENT,
    })

    if (!user1.isRight() || !user2.isRight()) return

    await sut.execute({
      userId: user1.value.user.id,
      ra: "12345678",
      courseId: "course-1",
    })

    const response = await sut.execute({
      userId: user2.value.user.id,
      ra: "12345678",
      courseId: "course-1",
    })

    expect(response.isLeft()).toBe(true)
    expect(studentRepo.items.length).toBe(1)
  })
})