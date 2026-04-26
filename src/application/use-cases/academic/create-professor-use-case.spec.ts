import { describe, expect, it, beforeEach } from "vitest"
import { InMemoryProfessorRepository } from "../../../tests/repositories/in-memory-professor-repository"
import { InMemoryUserRepository } from "@/tests/repositories/in-memory-user-repository"
import { CreateUserUseCase } from "../user/create-user-use-case"
import { CreateProfessorUseCase } from "./create-professor-use-case"
import { UserRole } from "@domain/user/entity/User"
import { Course } from "@/domain/course/entity/Course"
import { InMemoryCourseRepository } from "@/tests/repositories/in-memory-course-repository"

let userRepo: InMemoryUserRepository
let professorRepo: InMemoryProfessorRepository
let courseRepo: InMemoryCourseRepository
let createUser: CreateUserUseCase
let sut: CreateProfessorUseCase

describe("Create professor use case", () => {
  beforeEach(() => {
    userRepo = new InMemoryUserRepository()
    professorRepo = new InMemoryProfessorRepository()
    courseRepo = new InMemoryCourseRepository()

    createUser = new CreateUserUseCase(userRepo)
    sut = new CreateProfessorUseCase(userRepo, professorRepo, courseRepo)
  })

  async function createCourse() {
    const course = Course.create({
      name: "GTI"
    })

    await courseRepo.create(course)

    return course
  }

  it("should be able to create a professor", async () => {
    const course = await createCourse()

    const userResponse = await createUser.execute({
      name: "Professor X",
      email: "prof@email.com",
      password: "123456",
      role: UserRole.PROFESSOR,
    })

    expect(userResponse.isRight()).toBe(true)
    if (!userResponse.isRight()) return

    const user = userResponse.value.user

    const response = await sut.execute({
      userId: user.id,
      department: "TI",
      courseIds: [course.id]
    })

    expect(response.isRight()).toBe(true)
    expect(professorRepo.items.length).toBe(1)

    if (response.isRight()) {
      expect(response.value.professor.userId).toBe(user.id)
      expect(response.value.professor.department).toBe("TI")
    }
  })
})