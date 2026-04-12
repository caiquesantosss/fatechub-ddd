import { Professor } from "../entity/Professor"

export interface ProfessorRepository {
    create(professor :Professor): Promise<void>
    findByUserId(userId: string): Promise<Professor | null>
}