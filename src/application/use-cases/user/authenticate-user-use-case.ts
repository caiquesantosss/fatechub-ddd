import { Either, left, right } from "../../../core/either"
import { User } from "@domain/user/entity/User"
import { UserRepository } from "@domain/user/repository/user-repository"

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
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
    password
  }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {

    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      return left(new Error('Credenciais inválidas'))
    }

    const isPasswordValid = await user.password.compare(password)

    if (!isPasswordValid) {
      return left(new Error("Credenciais inválidas"))
    }
    
    return right({ user })
  }
}