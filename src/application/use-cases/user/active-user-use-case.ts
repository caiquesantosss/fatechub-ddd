import { User } from "@domain/user/entity/User"
import { Either, left, right } from "../../../core/either"
import { UserRepository } from "@domain/user/repository/user-repository"

interface ActiveUserRequest {
    email: string
}

type ActiveUserResponse = Either<
    Error,
    {
        user: User
    }
>

export class ActiveUserUseCase {
    constructor(private userRepository: UserRepository) { }

    async execute({
        email
    }: ActiveUserRequest): Promise<ActiveUserResponse> {
        const user = await this.userRepository.findByEmail(email)

        if (!user) {
            return left(new Error('Usuário não encontrado!'))
        }

        try {
            user.activate()
        } catch (err) {
            return left(err as Error)
        }

        await this.userRepository.save(user)

        return right({ user })
    }
}