import { describe, expect, it, beforeEach } from "vitest"
import { InMemoryUserRepository } from "@/tests/repositories/in-memory-user-repository"
import { InMemoryProfessorRepository } from "@/tests/repositories/in-memory-professor-repository"
import { InMemoryCourseRepository } from "@/tests/repositories/in-memory-course-repository"
import { CreateUserUseCase } from "../user/create-user-use-case"
import { CreateProfessorUseCase } from "./create-professor-use-case"
import { RegisterProfessorUseCase } from "./register-professor-use-case"
import { Course } from "@/domain/course/entity/Course"
import { User, UserRole } from "@/domain/user/entity/User"
import { Email } from "@/domain/user/values-objects/email"
import { Password } from "@/domain/user/values-objects/password"

let userRepo: InMemoryUserRepository
let professorRepo: InMemoryProfessorRepository
let courseRepo: InMemoryCourseRepository
let createUser: CreateUserUseCase
let createProfessor: CreateProfessorUseCase
let sut: RegisterProfessorUseCase

describe("Register Professor Use Case", () => {
  beforeEach(() => {
    userRepo = new InMemoryUserRepository()
    professorRepo = new InMemoryProfessorRepository()
    courseRepo = new InMemoryCourseRepository()

    createUser = new CreateUserUseCase(userRepo)
    createProfessor = new CreateProfessorUseCase(
      userRepo,
      professorRepo,
      courseRepo
    )

    sut = new RegisterProfessorUseCase(
      createUser,
      createProfessor
    )
  })

  async function makeUser(role: UserRole) {
    const userOrError = User.create({
      name: role,
      email: Email.create(`${role}@email.com`),
      password: await Password.create("123456"),
      role
    })

    if (userOrError.isLeft()) throw userOrError.value

    return userOrError.value
  }

  async function createCourse() {
    const course = Course.create({
      name: "ADS"
    })

    await courseRepo.create(course)

    return course
  }

  it("should allow coordinator to register a professor", async () => {
    const actor = await makeUser(UserRole.COORDINATOR)
    const course = await createCourse()

    const result = await sut.execute({
      actor,
      name: "Professor X",
      email: "prof@email.com",
      password: "123456",
      courseIds: [course.id],
      department: "TI"
    })

    expect(result.isRight()).toBe(true)
    expect(userRepo.items).toHaveLength(1)
    expect(professorRepo.items).toHaveLength(1)
  })

  it("should allow secretary to register a professor", async () => {
    const actor = await makeUser(UserRole.SECRETARY)
    const course = await createCourse()

    const result = await sut.execute({
      actor,
      name: "Professor X",
      email: "prof@email.com",
      password: "123456",
      courseIds: [course.id],
      department: "TI"
    })

    expect(result.isRight()).toBe(true)
    expect(userRepo.items).toHaveLength(1)
    expect(professorRepo.items).toHaveLength(1)
  })

  it("should not allow student to register a professor", async () => {
    const actor = await makeUser(UserRole.STUDENT)
    const course = await createCourse()

    const result = await sut.execute({
      actor,
      name: "Professor X",
      email: "prof@email.com",
      password: "123456",
      courseIds: [course.id],
      department: "TI"
    })

    expect(result.isLeft()).toBe(true)
    expect(userRepo.items).toHaveLength(0)
    expect(professorRepo.items).toHaveLength(0)
  })

  it("should not register professor without course", async () => {
    const actor = await makeUser(UserRole.COORDINATOR)

    const result = await sut.execute({
      actor,
      name: "Professor X",
      email: "prof@email.com",
      password: "123456",
      courseIds: [],
      department: "TI"
    })

    expect(result.isLeft()).toBe(true)
    expect(userRepo.items).toHaveLength(0)
    expect(professorRepo.items).toHaveLength(0)
  })

  it("should not register professor with non-existing course", async () => {
    const actor = await makeUser(UserRole.COORDINATOR)

    const result = await sut.execute({
      actor,
      name: "Professor X",
      email: "prof@email.com",
      password: "123456",
      courseIds: ["fake-course-id"],
      department: "TI"
    })

    expect(result.isLeft()).toBe(true)
  })
})