import { Discipline } from "../entity/Discipline"

export interface DisciplineRepository {
    create(discipline: Discipline): Promise<void>
    findById(id: string): Promise<Discipline | null>
    findByNameAndCourse(name: string, courseId: string): Promise<Discipline | null>
    save(discipline: Discipline): Promise<void>
}