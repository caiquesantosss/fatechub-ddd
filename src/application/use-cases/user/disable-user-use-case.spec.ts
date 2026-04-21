import { InMemoryUserRepository } from '../../../tests/repositories/in-memory-user-repository'
import { describe, it, expect } from 'vitest'
import { CreateUserUseCase } from './create-user-use-case'
import { UserRole } from '@domain/user/entity/User'
import { DisableUserUseCase } from './disable-user-use-case'

describe('Disable user', () => {
    it('should be able to disable an user', async () => {
        const r = new InMemoryUserRepository()
        const useCase = new CreateUserUseCase(r)

        await useCase.execute({
            name: "Caíque",
            email: "caique@email.com",
            password: "123456",
            role: UserRole.STUDENT, 
        })

        const disableUser = new DisableUserUseCase(r)

        const response = await disableUser.execute({
            email: "caique@email.com"
        })

        expect(response.isRight()).toBe(true)

        if (!response.isRight()) return

        expect(response.value.user.status).toBe('inactive')
    })

    it('should be not able to disable an already inactive user', async () => {
        const r = new InMemoryUserRepository()
        const useCase = new CreateUserUseCase(r)

        await useCase.execute({
            name: "Caíque",
            email: "caique@email.com",
            password: "123456",
            role: UserRole.STUDENT,
        })

        const disableUser = new DisableUserUseCase(r)

        await disableUser.execute({ email: 'caique@email.com' })

        const response = await disableUser.execute({
            email: 'caique@email.com'
        })

        expect(response.isLeft()).toBe(true)
    })
})