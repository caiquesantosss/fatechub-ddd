import { describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '../../../tests/repositories/in-memory-user-repository'
import { CreateUserUseCase } from './create-user-use-case'
import { UserRole } from '@domain/user/entity/User'
import { GetUserUseCase } from './get-user-use-case'
import { beforeEach } from 'vitest'

let repo: InMemoryUserRepository
let sut: CreateUserUseCase

describe('Get User', () => {
    beforeEach(() => {
        repo = new InMemoryUserRepository() 
        sut = new CreateUserUseCase(repo)
    })

    it('should be able to get an user by email', async () => {

        await sut.execute({
            name: "Caíque",
            email: "caique@email.com",
            password: "123456",
            role: UserRole.STUDENT, 
        })

        const getUser = new GetUserUseCase(repo)
        const response = await getUser.execute({
            email: 'caique@email.com'
        })

        expect(response.isRight()).toBe(true)
        if (!response.isRight()) return
        expect(response.value.user.email.getValue()).toBe("caique@email.com")
    })
})