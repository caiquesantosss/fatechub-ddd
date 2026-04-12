import { Either, left, right } from "../../../core/either"
import { User } from "@domain/user/entity/User"
import { UserRepository } from "@domain/user/repository/user-repository"
import { Password } from "@domain/user/values-objects/password"

interface AuthenticateUserRequest {
    email: string
    password: string
}

type AuthenticateUserResponse = Either<
    Error,
    {
        user: User
    }
>

export class AuthenticateUserUseCase {
    constructor(private userRepository: UserRepository) { }

    async execute({
        email,
        password
    }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {

        const user = await this.userRepository.findByEmail(email)

        if (!user) {
            return left(new Error('Credenciais inválidas'))
        }

        let passwordVO

        try {
            passwordVO = Password.create(password)
        } catch {
            return left(new Error("Credenciais inválidas"))
        }

        if (!user.password.equals(passwordVO)) {
            return left(new Error("Credenciais inválidas"))
        }

        return right({ user })
    }
}