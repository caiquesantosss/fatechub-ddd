import { User } from "../entity/User"

export interface UserRepository {
     findById(id: string): Promise<User | null>
     create(user: User): Promise<void>
     findByEmail(email: string): Promise<User | null>
     delete(id: string): Promise<void>
     save(user: User): Promise<void>
}

