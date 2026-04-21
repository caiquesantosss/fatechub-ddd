import { describe, it, expect, beforeEach } from "vitest"
import { CreateDisciplineUseCase } from "@/application/use-cases/discipline/create-discipline-use-case"
import { InMemoryDisciplineRepository } from '../../../tests/repositories/in-memory-discipline-repository'
import { User, UserRole } from "@/domain/user/entity/User"
import { Email } from "@/domain/user/values-objects/email"
import { Password } from "@/domain/user/values-objects/password"

let disciplineRepo: InMemoryDisciplineRepository
let sut: CreateDisciplineUseCase

describe("Create Discipline Use Case", () => {
    beforeEach(() => {
        disciplineRepo = new InMemoryDisciplineRepository()
        sut = new CreateDisciplineUseCase(disciplineRepo)
    })

    it("should be able to create a discipline", async () => {

        const password = await Password.create('123456')

        const userOrError = User.create({
            name: "Coordenador",
            email: Email.create("coord@email.com"),
            password,
            role: UserRole.COORDINATOR
        })

        if (userOrError.isLeft()) {
            throw userOrError.value
        }

        const user = userOrError.value

        const result = await sut.execute({
            user,
            name: "Arquitetura de Software",
            courseId: "course-1"
        })

        expect(result.isRight()).toBe(true)

        if (result.isRight()) {
            expect(disciplineRepo.items).toHaveLength(1)
            expect(disciplineRepo.items[0].name).toBe("Arquitetura de Software")
            expect(result.value.discipline.name).toBe("Arquitetura de Software")
        }
    })

    it("should not allow non-coordinator to create a discipline", async () => {
        const password = await Password.create('123456')

        const userOrError = User.create({
            name: "Aluno",
            email: Email.create("aluno@email.com"),
            password,
            role: UserRole.STUDENT
        })

        if (userOrError.isLeft()) {
            throw userOrError.value
        }

        const user = userOrError.value

        const result = await sut.execute({
            user,
            name: "Banco de Dados",
            courseId: "course-1"
        })

        expect(result.isLeft()).toBe(true)
    })
})