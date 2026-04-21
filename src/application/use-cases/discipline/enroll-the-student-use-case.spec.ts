import { describe, it, expect, beforeEach } from "vitest"
import { EnrollStudentUseCase } from "@application/use-cases/discipline/enroll-the-student-use-case"
import { InMemoryEnrollmentRepository } from "@/tests/repositories/in-memory-enrollment-repository"
import { User, UserRole } from "@/domain/user/entity/User"
import { Email } from "@/domain/user/values-objects/email"
import { Password } from "@/domain/user/values-objects/password"

let enrollmentRepo: InMemoryEnrollmentRepository
let sut: EnrollStudentUseCase

describe("Enroll Student Use Case", () => {
    beforeEach(() => {
        enrollmentRepo = new InMemoryEnrollmentRepository()
        sut = new EnrollStudentUseCase(enrollmentRepo)
    })

    it("should be able to enroll a student", async () => {
        const password = await Password.create('123456')

        const userOrError = User.create({
            name: "Coordenador",
            email: Email.create("coord@email.com"),
            password,
            role: UserRole.COORDINATOR
        })

        if (userOrError.isLeft()) throw userOrError.value

        const user = userOrError.value

        const result = await sut.execute({
            user,
            studentId: "student-1",
            disciplineId: "disc-1"
        })

        expect(result.isRight()).toBe(true)

        if (result.isRight()) {
            expect(enrollmentRepo.items).toHaveLength(1)
            expect(result.value.enrollment.studentId).toBe("student-1")
        }
    })

    it("should not allow duplicate enrollment", async () => {
        const password = await Password.create('123456')

        const userOrError = User.create({
            name: "Coordenador",
            email: Email.create("coord@email.com"),
            password,
            role: UserRole.COORDINATOR
        })

        if (userOrError.isLeft()) throw userOrError.value
        const user = userOrError.value

        await sut.execute({
            user,
            studentId: "student-1",
            disciplineId: "disc-1"
        })

        const result = await sut.execute({
            user,
            studentId: "student-1",
            disciplineId: "disc-1"
        })

        expect(result.isLeft()).toBe(true)
    })

    it("should not allow non-coordinator to enroll", async () => {
        const password = await Password.create('123456')

        const userOrError = User.create({
            name: "Aluno",
            email: Email.create("aluno@email.com"),
            password,
            role: UserRole.STUDENT
        })

        if (userOrError.isLeft()) throw userOrError.value
        const user = userOrError.value

        const result = await sut.execute({
            user,
            studentId: "student-1",
            disciplineId: "disc-1"
        })

        expect(result.isLeft()).toBe(true)
    })

    it("should be able to enroll multiple students in the same discipline", async () => {
        const password = await Password.create('123456')
        
        const userOrError = User.create({
            name: "Coordenador",
            email: Email.create("coord@email.com"),
            password,
            role: UserRole.COORDINATOR
        })

        if (userOrError.isLeft()) throw userOrError.value
        const user = userOrError.value

        const students = ["student-1", "student-2", "student-3"]

        for (const studentId of students) {
            const result = await sut.execute({
                user,
                studentId,
                disciplineId: "disc-1"
            })

            expect(result.isRight()).toBe(true)
        }

        expect(enrollmentRepo.items).toHaveLength(3)

        const enrolledStudentIds = enrollmentRepo.items.map(e => e.studentId)

        expect(enrolledStudentIds).toEqual(
            expect.arrayContaining(students)
        )
    })
})