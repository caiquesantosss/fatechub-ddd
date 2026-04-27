import { describe, expect, it, beforeEach } from "vitest"
import { InMemoryUserRepository } from "@/tests/repositories/in-memory-user-repository"
import { InMemoryStudentRepository } from "@/tests/repositories/in-memory-student-repository"
import { CreateUserUseCase } from "../user/create-user-use-case"
import { CreateStudentUseCase } from "./create-student-use-case"
import { RegisterStudentUseCase } from "./register-student-use-case"
import { User, UserRole } from "@/domain/user/entity/User"
import { Email } from "@/domain/user/values-objects/email"
import { Password } from "@/domain/user/values-objects/password"

describe("Register Student Use Case", () => {
  let userRepo: InMemoryUserRepository
  let studentRepo: InMemoryStudentRepository
  let registerUseCase: RegisterStudentUseCase

  beforeEach(() => {
    userRepo = new InMemoryUserRepository()
    studentRepo = new InMemoryStudentRepository()

    const createUser = new CreateUserUseCase(userRepo)
    const createStudent = new CreateStudentUseCase(userRepo, studentRepo)

    registerUseCase = new RegisterStudentUseCase(
      createUser,
      createStudent
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

  it("should be able to register a student", async () => {
    const actor = await makeUser(UserRole.COORDINATOR)

    const result = await registerUseCase.execute({
      actor,
      name: "Caíque",
      email: "teste@email.com",
      password: "123456",
      ra: "12345678",
      courseId: "course-1"
    })

    expect(result.isRight()).toBe(true)

    expect(userRepo.items.length).toBe(1)
    expect(studentRepo.items.length).toBe(1)
  })

  it("should not register with duplicate email", async () => {
    const actor = await makeUser(UserRole.COORDINATOR)
    await registerUseCase.execute({
      actor, 
      name: "Caíque",
      email: "teste@email.com",
      password: "123456",
      ra: "12345678",
      courseId: "course-1"
    })

    const result = await registerUseCase.execute({
      actor, 
      name: "Outro",
      email: "teste@email.com",
      password: "123456",
      ra: "87654321",
      courseId: "course-1"
    })

    expect(result.isLeft()).toBe(true)
    expect(userRepo.items.length).toBe(1)
    expect(studentRepo.items.length).toBe(1)
  })

  it("should not register with duplicate RA", async () => {
    const actor = await makeUser(UserRole.COORDINATOR)

    await registerUseCase.execute({
      actor, 
      name: "Caíque",
      email: "caique@email.com",
      password: "12345678",
      ra: "12345678",
      courseId: "course-1"
    })

    const result = await registerUseCase.execute({
      actor,
      name: "Outro",
      email: "outro@email.com",
      password: "12345678",
      ra: "12345678",
      courseId: "course-1"
    })

    expect(result.isLeft()).toBe(true)

    expect(userRepo.items.length).toBe(2) 
    expect(studentRepo.items.length).toBe(1)
  })
})