import { User } from "@domain/user/entity/User"
import { Either, left, right } from "../../../core/either"
import { UserRepository } from "@domain/user/repository/user-repository"

interface GetUserRequest {
    email: string
}

type GetUserResponse = Either<
    Error, 
    {
        user: User
    }
>

export class GetUserUseCase {
    constructor(private userRepository: UserRepository) { }

    async execute({ email }: GetUserRequest): Promise<GetUserResponse> {
        const user = await this.userRepository.findByEmail(email)

        if (!user) {
            return left(new Error('Usuário não encontrado!'))
        }

        return right({ user })
    }
}