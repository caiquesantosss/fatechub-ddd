import { User, UserRole } from "@domain/user/entity/User"
import { Either, left, right } from "../../../core/either"
import { UserRepository } from "@domain/user/repository/user-repository"

interface ActiveUserRequest {
    actor: User
    userId: string
}

type ActiveUserResponse = Either<
    Error,
    {
        user: User
    }
>

export class ActiveUserUseCase {
    constructor(private userRepository: UserRepository) { }

    async execute(data: ActiveUserRequest): Promise<ActiveUserResponse> {
        if (
            data.actor.role !== UserRole.COORDINATOR &&
            data.actor.role !== UserRole.SECRETARY
        ) {
            return left(new Error("Apenas coordenação ou secretaria podem ativar usuários"))
        }

        const user = await this.userRepository.findById(data.userId)

        if (!user) {
            return left(new Error("Usuário não encontrado"))
        }

        try {
            user.activate()
        } catch (error) {
            return left(error as Error)
        }

        await this.userRepository.save(user)

        return right({
            user,
        })
    }
}