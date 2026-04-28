import { describe, expect, it, beforeEach } from "vitest"
import { AssignProfessorToCourseUseCase } from "./assign-professor-to-course-use-case"
import { InMemoryProfessorRepository } from "@/tests/repositories/in-memory-professor-repository"
import { InMemoryCourseRepository } from "@/tests/repositories/in-memory-course-repository"
import { Professor } from "@/domain/academic/entity/Professor"
import { Course } from "@/domain/course/entity/Course"
import { User, UserRole } from "@/domain/user/entity/User"
import { Email } from "@/domain/user/values-objects/email"
import { Password } from "@/domain/user/values-objects/password"

let professorRepo: InMemoryProfessorRepository
let courseRepo: InMemoryCourseRepository
let sut: AssignProfessorToCourseUseCase

describe("Assign Professor To Course Use Case", () => {
  beforeEach(() => {
    professorRepo = new InMemoryProfessorRepository()
    courseRepo = new InMemoryCourseRepository()
    sut = new AssignProfessorToCourseUseCase(professorRepo, courseRepo)
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

  it("should allow coordinator to assign professor to course", async () => {
    const actor = await makeUser(UserRole.COORDINATOR)

    const professor = Professor.create({
      id: "professor-1",
      userId: "user-professor-1",
      courseIds: ["course-1"],
      department: "TI"
    })

    const course = Course.create({
      name: "ADS"
    })

    await professorRepo.create(professor)
    await courseRepo.create(course)

    const result = await sut.execute({
      actor,
      professorId: professor.id,
      courseId: course.id
    })

    expect(result.isRight()).toBe(true)
    expect(professorRepo.items[0].courseIds).toContain(course.id)
  })

  it("should allow secretary to assign professor to course", async () => {
    const actor = await makeUser(UserRole.SECRETARY)

    const professor = Professor.create({
      id: "professor-1",
      userId: "user-professor-1",
      courseIds: ["course-1"],
      department: "TI"
    })

    const course = Course.create({
      name: "Engenharia"
    })

    await professorRepo.create(professor)
    await courseRepo.create(course)

    const result = await sut.execute({
      actor,
      professorId: professor.id,
      courseId: course.id
    })

    expect(result.isRight()).toBe(true)
    expect(professorRepo.items[0].courseIds).toContain(course.id)
  })

  it("should not allow student to assign professor to course", async () => {
    const actor = await makeUser(UserRole.STUDENT)

    const professor = Professor.create({
      id: "professor-1",
      userId: "user-professor-1",
      courseIds: ["course-1"],
      department: "TI"
    })

    const course = Course.create({
      name: "ADS"
    })

    await professorRepo.create(professor)
    await courseRepo.create(course)

    const result = await sut.execute({
      actor,
      professorId: professor.id,
      courseId: course.id
    })

    expect(result.isLeft()).toBe(true)
    expect(professorRepo.items[0].courseIds).not.toContain(course.id)
  })

  it("should not assign professor to non-existing course", async () => {
    const actor = await makeUser(UserRole.COORDINATOR)

    const professor = Professor.create({
      id: "professor-1",
      userId: "user-professor-1",
      courseIds: ["course-1"],
      department: "TI"
    })

    await professorRepo.create(professor)

    const result = await sut.execute({
      actor,
      professorId: professor.id,
      courseId: "non-existing-course"
    })

    expect(result.isLeft()).toBe(true)
  })

  it("should not assign non-existing professor to course", async () => {
    const actor = await makeUser(UserRole.COORDINATOR)

    const course = Course.create({
      name: "ADS"
    })

    await courseRepo.create(course)

    const result = await sut.execute({
      actor,
      professorId: "non-existing-professor",
      courseId: course.id
    })

    expect(result.isLeft()).toBe(true)
  })

  it("should not assign duplicated course to professor", async () => {
    const actor = await makeUser(UserRole.COORDINATOR)

    const course = Course.create({
      name: "ADS"
    })

    const professor = Professor.create({
      id: "professor-1",
      userId: "user-professor-1",
      courseIds: [course.id],
      department: "TI"
    })

    await professorRepo.create(professor)
    await courseRepo.create(course)

    const result = await sut.execute({
      actor,
      professorId: professor.id,
      courseId: course.id
    })

    expect(result.isLeft()).toBe(true)
    expect(professorRepo.items[0].courseIds).toHaveLength(1)
  })
})