import { describe, it, expect, beforeEach } from "vitest"
import { GetGradeUseCase } from "@/application/use-cases/discipline/get-grade-use-case"
import { InMemoryEnrollmentRepository } from "@/tests/repositories/in-memory-enrollment-repository"
import { Enrollment } from "@/domain/discipline/entity/Enrollment"
import { Grade } from "@/domain/discipline/values-objects/grade"

let enrollmentRepo: InMemoryEnrollmentRepository
let sut: GetGradeUseCase

describe("Get Grade Use Case", () => {
    beforeEach(() => {
        enrollmentRepo = new InMemoryEnrollmentRepository()
        sut = new GetGradeUseCase(enrollmentRepo)
    })

    it("should be able to get a grade", async () => {
        const enrollment = Enrollment.create({
            studentId: "student-1",
            disciplineId: "disc-1"
        })

        enrollment.addGrade(Grade.create("B1", 8))

        await enrollmentRepo.create(enrollment)

        const result = await sut.execute({
            enrollmentId: enrollment.id,
            type: "B1"
        })

        expect(result.isRight()).toBe(true)

        if (result.isRight()) {
            expect(result.value.value).toBe(8)
        }
    })

    it("should not find enrollment", async () => {
        const result = await sut.execute({
            enrollmentId: "non-existing-id",
            type: "B1"
        })

        expect(result.isLeft()).toBe(true)
    })

    it("should not find grade", async () => {
        const enrollment = Enrollment.create({
            studentId: "student-1",
            disciplineId: "disc-1"
        })

        await enrollmentRepo.create(enrollment)

        const result = await sut.execute({
            enrollmentId: enrollment.id,
            type: "B1"
        })

        expect(result.isLeft()).toBe(true)
    })

    it("should be able to get B1, B2 and B3 grades", async () => {
        const enrollment = Enrollment.create({
            studentId: "student-1",
            disciplineId: "disc-1"
        })

        enrollment.addGrade(Grade.create("B1", 7))
        enrollment.addGrade(Grade.create("B2", 8))
        enrollment.addGrade(Grade.create("B3", 9))

        await enrollmentRepo.create(enrollment)

        const resultB1 = await sut.execute({
            enrollmentId: enrollment.id,
            type: "B1"
        })

        const resultB2 = await sut.execute({
            enrollmentId: enrollment.id,
            type: "B2"
        })

        const resultB3 = await sut.execute({
            enrollmentId: enrollment.id,
            type: "B3"
        })

        expect(resultB1.isRight()).toBe(true)
        expect(resultB2.isRight()).toBe(true)
        expect(resultB3.isRight()).toBe(true)

        if (resultB1.isRight() && resultB2.isRight() && resultB3.isRight()) {
            expect(resultB1.value.value).toBe(7)
            expect(resultB2.value.value).toBe(8)
            expect(resultB3.value.value).toBe(9)
        }
    })
})