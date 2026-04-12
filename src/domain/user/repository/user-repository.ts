import { User } from "../entity/User"

export interface UserRepository {
     findById(id: string): Promise<User | null>
     create(user: User): Promise<void>
     findByEmail(email: string): Promise<User | null>
     save(user: User): Promise<void>
}

