import { Either, left, right } from "@/core/either"
import { RequestRepository } from "@/domain/secretariat/repository/request-repository"
import { User, UserRole } from "@/domain/user/entity/User"
import { Request } from "@/domain/secretariat/entity/request"

interface CreateRequestInput {
    user: User
    documentId: string
}

type CreateRequestResponse = Either<
    Error,
    {
        request: Request
    }
>

export class CreateRequestUseCase {
    constructor(
        private requestRepo: RequestRepository
    ) { }

    async execute({
        user,
        documentId
    }: CreateRequestInput): Promise<CreateRequestResponse> {

        if (user.role !== UserRole.STUDENT) {
            return left(new Error('Apenas alunos podem solicitar documentos'))
        }

        const request = Request.create({
            studentId: user.id,
            documentId
        })

        await this.requestRepo.create(request)

        return right({
            request
        })
    }
}