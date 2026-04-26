import { Course } from "@/domain/course/entity/Course"
import { CourseRepository } from "@/domain/course/repository/course-repository"
import { db } from "../database/connection"
import { courses } from "../database/schema"
import { eq } from "drizzle-orm"

export class DrizzleCourseRepository implements CourseRepository {
  async create(course: Course): Promise<void> {
    await db.insert(courses).values({
      id: course.id,
      name: course.name
    })
  }

  async findByName(name: string): Promise<Course | null> {
    const result = await db
      .select()
      .from(courses)
      .where(eq(courses.name, name))

    if (!result.length) return null

    return Course.restore({
      id: result[0].id,
      name: result[0].name
    })
  }

  async findById(id: string): Promise<Course | null> {
    const result = await db
      .select()
      .from(courses)
      .where(eq(courses.id, id))

    if (!result.length) return null

    return Course.restore({
      id: result[0].id,
      name: result[0].name
    })
  }
}