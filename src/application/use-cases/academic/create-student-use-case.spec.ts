import { describe, expect, it } from "vitest"
import { InMemoryUserRepository } from "../../../tests/repositories/in-memory-user/in-memory-user-repository"
import { InMemoryStudentRepository } from "../../../tests/repositories/in-memory-academic/in-memory-student-repository"
import { CreateStudentUseCase } from "./create-student-use-case"
import { CreateUserUseCase } from "../user/create-user-use-case"
import { UserRole } from "@domain/user/entity/User"

describe("Create student use-case", () => {
  it("should be able to create a student", async () => {
    const userRepo = new InMemoryUserRepository()
    const studentRepo = new InMemoryStudentRepository()

    const createUser = new CreateUserUseCase(userRepo)
    const createStudent = new CreateStudentUseCase(userRepo, studentRepo)

    const userResponse = await createUser.execute({
      name: "Caíque",
      email: "caique@email.com",
      password: "123456",
      role: UserRole.STUDENT,
    })

    expect(userResponse.isRight()).toBe(true)
    if (!userResponse.isRight()) return

    const user = userResponse.value.user

    const studentResponse = await createStudent.execute({
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
    const userRepo = new InMemoryUserRepository()
    const studentRepo = new InMemoryStudentRepository()

    const createStudent = new CreateStudentUseCase(userRepo, studentRepo)

    const response = await createStudent.execute({
      userId: "fake-id",
      ra: "123456",
      courseId: "course-1",
    })

    expect(response.isLeft()).toBe(true)
    expect(studentRepo.items.length).toBe(0)
  })

  it("should not create student if user is not student role", async () => {
    const userRepo = new InMemoryUserRepository()
    const studentRepo = new InMemoryStudentRepository()

    const createUser = new CreateUserUseCase(userRepo)
    const createStudent = new CreateStudentUseCase(userRepo, studentRepo)

    const userResponse = await createUser.execute({
      name: "Caíque",
      email: "caique@email.com",
      password: "123456",
      role: UserRole.PROFESSOR,
    })

    if (!userResponse.isRight()) return

    const user = userResponse.value.user

    const response = await createStudent.execute({
      userId: user.id,
      ra: "123456",
      courseId: "course-1",
    })

    expect(response.isLeft()).toBe(true)
    expect(studentRepo.items.length).toBe(0)
  })

  it("should not allow duplicate RA", async () => {
    const userRepo = new InMemoryUserRepository()
    const studentRepo = new InMemoryStudentRepository()

    const createUser = new CreateUserUseCase(userRepo)
    const createStudent = new CreateStudentUseCase(userRepo, studentRepo)

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

    await createStudent.execute({
      userId: user1.value.user.id,
      ra: "12345678",
      courseId: "course-1",
    })

    const response = await createStudent.execute({
      userId: user2.value.user.id,
      ra: "12345678",
      courseId: "course-1",
    })

    expect(response.isLeft()).toBe(true)
    expect(studentRepo.items.length).toBe(1)
  })
})