import { RequestRepository } from "@/domain/secretariat/repository/request-repository"
import { Request } from '@domain/secretariat/entity/request'

export class InMemoryRequestRepository implements RequestRepository {
    public items: Request[] = []

    async create(request: Request): Promise<void> {
        this.items.push(request)
    }

    async findById(id: string): Promise<Request | null> {
        return this.items.find(item => item.id === id) ?? null
    }

    async save(request: Request): Promise<void> {
        const index = this.items.findIndex(item => item.id === request.id)

        if (index >= 0) {
            this.items[index] = request
        }
    }
}