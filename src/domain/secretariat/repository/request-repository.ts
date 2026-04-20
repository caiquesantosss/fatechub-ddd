import { Request } from '@domain/secretariat/entity/request'

export interface RequestRepository {
     create(request: Request): Promise<void>
     findById(id: string): Promise<Request | null> 
     save(request: Request): Promise<void> 
}

