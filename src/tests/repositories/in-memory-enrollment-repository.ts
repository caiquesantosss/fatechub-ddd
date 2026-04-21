import { Enrollment } from "@/domain/discipline/entity/enrollment"
import { EnrollmentRepository } from "@/domain/discipline/repository/enrollment-repository"

export class InMemoryEnrollmentRepository implements EnrollmentRepository {
    public items: Enrollment[] = []

    async create(enrollment: Enrollment): Promise<void> {
        this.items.push(enrollment)
    }

    async findById(id: string): Promise<Enrollment | null> {
        return this.items.find(item => item.id === id) ?? null
    }

    async findByStudentAndDiscipline(studentId: string, disciplineId: string) {
        return this.items.find(
            item =>
                item.studentId === studentId &&
                item.disciplineId === disciplineId
        ) ?? null
    }

    async save(enrollment: Enrollment): Promise<void> {
        const index = this.items.findIndex(item => item.id === enrollment.id)

        if (index >= 0) {
            this.items[index] = enrollment
        }
    }
}