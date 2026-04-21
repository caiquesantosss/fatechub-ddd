import { Either, left, right } from "../../../core/either"
import { User } from "@domain/user/entity/User"
import { UserRepository } from "@domain/user/repository/user-repository"
import { Password } from "@domain/user/values-objects/password"

interface UpdateUserUseCaseRequest {
  email: string
  name?: string
  password?: string
}

type UpdateUserUseCaseResponse = Either<
  Error,
  {
    user: User
  }
>

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
    name,
    password
  }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {

    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      return left(new Error('Usuário não encontrado!'))
    }

    if (name) {
      user.name = name
    }

    if (password) {
      let passwordVO

      try {
        passwordVO = await Password.create(password)
      } catch (error) {
        return left(error as Error)
      }

      user.password = passwordVO
    }

    await this.userRepository.save(user)

    return right({ user })
  }
}