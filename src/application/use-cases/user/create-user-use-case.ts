import { Either, left, right } from "../../../core/either"
import { User, UserRole } from "@domain/user/entity/User"
import { UserRepository } from "@domain/user/repository/user-repository"
import { Email } from "@domain/user/values-objects/email"
import { Password } from "@domain/user/values-objects/password"

interface CreateUserRequest {
    name: string
    email: string
    password: string
    role: UserRole
}

type CreateUserResponse = Either<
    Error,
    {
        user: User
    }
>

export class CreateUserUseCase {
    constructor(private userRepository: UserRepository) { }

    async execute({
        name,
        email,
        password,
        role,
    }: CreateUserRequest): Promise<CreateUserResponse> {

        let emailVO
        let passwordVO

        try {
            emailVO = Email.create(email)
            passwordVO = await Password.create(password) // 🔥 AQUI
        } catch (error) {
            return left(error as Error)
        }

        const existingEmail = await this.userRepository.findByEmail(email)

        if (existingEmail) {
            return left(new Error("Usuário já existe!"))
        }

        const userOrError = User.create({
            name,
            email: emailVO,
            password: passwordVO,
            role,
        })

        if (userOrError.isLeft()) {
            return left(userOrError.value)
        }

        const user = userOrError.value

        await this.userRepository.create(user)

        return right({ user })
    }
}