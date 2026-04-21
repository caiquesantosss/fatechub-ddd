import { describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '../../../tests/repositories/in-memory-user-repository'
import { CreateUserUseCase } from './create-user-use-case'
import { UserRole } from '@domain/user/entity/User'
import { GetUserUseCase } from './get-user-use-case'

describe('Get User', () => {
    it('should be able to get an user by email', async () => {
        const r = new InMemoryUserRepository()
        const useCase = new CreateUserUseCase(r)

        await useCase.execute({
            name: "Caíque",
            email: "caique@email.com",
            password: "123456",
            role: UserRole.STUDENT, 
        })

        const getUser = new GetUserUseCase(r)
        const response = await getUser.execute({
            email: 'caique@email.com'
        })

        expect(response.isRight()).toBe(true)
        if (!response.isRight()) return
        expect(response.value.user.email.getValue()).toBe("caique@email.com")
    })
})