import { RA } from "@/domain/user/values-objects/register-academic";
import { Student } from "../entity/Student";

export interface StudentRepository {
    create(student: Student): Promise<void>
    findByUserId(userId: string): Promise<Student | null>
    findByRA(ra: RA): Promise<Student | null>
}