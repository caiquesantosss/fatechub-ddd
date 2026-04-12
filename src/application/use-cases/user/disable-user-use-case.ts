import { Either, left, right } from "../../../core/either"
import { User } from "@domain/user/entity/User"
import { UserRepository } from "@domain/user/repository/user-repository"

interface DisableUserRequest {
    email: string
}

type DisableUserResponse = Either<
    Error,
    {
        user: User
    }
>

export class DisableUserUseCase {
    constructor(private userRepository: UserRepository) { }

    async execute({
        email
    }: DisableUserRequest): Promise<DisableUserResponse> {
        const user = await this.userRepository.findByEmail(email)

        if (!user) {
            return left(new Error('Usuário não encontrado!'))
        }

        try {
            user.disable()
        } catch (err) {
            return left(err as Error)
        }

        await this.userRepository.save(user)

        return right({ user })
    }
}