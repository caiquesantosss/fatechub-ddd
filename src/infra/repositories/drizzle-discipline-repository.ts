import { Discipline } from "@/domain/discipline/entity/Discipline";
import { DisciplineRepository } from "@/domain/discipline/repository/discipline-repository";

export class DrizzleDisciplineRepository implements DisciplineRepository {
    create(discipline: Discipline): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findById(id: string): Promise<Discipline | null> {
        throw new Error("Method not implemented.");
    }
    findByNameAndCourse(name: string, courseId: string): Promise<Discipline | null> {
        throw new Error("Method not implemented.");
    }
    save(discipline: Discipline): Promise<void> {
        throw new Error("Method not implemented.");
    }

}