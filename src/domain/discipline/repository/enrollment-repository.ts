import { Enrollment } from "../entity/Enrollment"

export interface EnrollmentRepository {
    create(enrollment: Enrollment): Promise<void>
    findById(id: string): Promise<Enrollment | null>
    findByStudentAndDiscipline(
        studentId: string,
        disciplineId: string
    ): Promise<Enrollment | null>
    save(enrollment: Enrollment): Promise<void>
}