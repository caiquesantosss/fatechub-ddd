import { Professor } from "@/domain/academic/entity/Professor";
import { ProfessorRepository } from "@/domain/academic/repository/professor-repository"

export class InMemoryProfessorRepository implements ProfessorRepository {
    public items: Professor[] = []

    async create(professor: Professor): Promise<void> {
        this.items.push(professor)
    }

    async findById(id: string): Promise<Professor | null> {
        return this.items.find(item => item.id === id) ?? null
    }

    async findByUserId(userId: string): Promise<Professor | null> {
        return this.items.find(s => s.userId === userId) ?? null
    }

    async addCourse(professorId: string, courseId: string): Promise<void> {
        const professor = this.items.find(p => p.id === professorId)

        if (!professor) return

        professor.courseIds.push(courseId)
    }
}