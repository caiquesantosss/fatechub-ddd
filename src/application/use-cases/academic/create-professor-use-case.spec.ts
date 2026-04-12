import { InMemoryProfessorRepository } from "../../../tests/repositories/in-memory-academic/in-memory-professor-repository"
import { InMemoryUserRepository } from "@/tests/repositories/in-memory-user/in-memory-user-repository"
import { describe, expect, it } from "vitest"
import { CreateUserUseCase } from "../user/create-user-use-case"
import { CreateProfessorUseCase } from "./create-professor-use-case"
import { User, UserRole } from "@domain/user/entity/User"

describe('Create professor use case', () => {
    it('should be able to create a professor', async () => {
        const userRepo = new InMemoryUserRepository()
        const professorRepo = new InMemoryProfessorRepository()

        const createUser = new CreateUserUseCase(userRepo)
        const createProfessor = new CreateProfessorUseCase(userRepo, professorRepo)

        const userResponse = await createUser.execute({
            name: "Professor X",
            email: "prof@email.com",
            password: "123456",
            role: UserRole.PROFESSOR,
        })

        if (!userResponse.isRight()) return

        const user = userResponse.value.user

        const response = await createProfessor.execute({
            userId: user.id,
            department: 'TI'
        })

        expect(response.isRight()).toBe(true)
        expect(professorRepo.items.length).toBe(1)

    })
})