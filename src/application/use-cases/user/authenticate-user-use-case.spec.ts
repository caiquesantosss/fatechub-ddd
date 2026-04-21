import { describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '../../../tests/repositories/in-memory-user-repository'
import { CreateUserUseCase } from './create-user-use-case'
import { UserRole } from '@domain/user/entity/User'
import { AuthenticateUserUseCase } from './authenticate-user-use-case'

describe('Authenticate User', () => {
    it('should be able to authenticate the user', async () => {
        const r = new InMemoryUserRepository()
        const useCase = new CreateUserUseCase(r)

        await useCase.execute({
            name: "Caíque",
            email: "caique@email.com",
            password: "123456",
            role: UserRole.STUDENT,
        })

        const authenticateUser = new AuthenticateUserUseCase(r)
        const response = await authenticateUser.execute({
            email: "caique@email.com",
            password: "123456"
        })

        expect(response.isRight()).toBe(true)
    })
})