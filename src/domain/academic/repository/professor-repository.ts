import { Professor } from "../entity/Professor"

export interface ProfessorRepository {
    create(professor: Professor): Promise<void>
    findById(id: string): Promise<Professor | null>
    findByUserId(userId: string): Promise<Professor | null>
}