import { Course } from "@/domain/course/entity/Course";
import { CourseRepository } from "@/domain/course/repository/course-repository"

export class InMemoryCourseRepository implements CourseRepository {
    public items: Course[] = []

    async create(course: Course): Promise<void> {
        this.items.push(course)
    }
    async findByName(name: String): Promise<Course | null> {
        return this.items.find(
            item => item.name === name
        ) ?? null
    }
    async findById(id: string): Promise<Course | null> {
        return this.items.find(item => item.id === id) ?? null
    }
}