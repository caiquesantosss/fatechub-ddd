import { Course } from "../entity/Course";

export interface CourseRepository {
    create(course: Course): Promise<void>
    findByName(name: String): Promise<Course | null>
    findById(id: string): Promise<Course | null> 
}