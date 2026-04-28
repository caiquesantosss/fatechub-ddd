import { Professor } from "@/domain/academic/entity/Professor"
import { ProfessorRepository } from "@/domain/academic/repository/professor-repository"
import { professorCourses, professors } from "../database/schema"
import { db } from "../database/connection"
import { eq } from "drizzle-orm"

export class DrizzleProfessorRepository implements ProfessorRepository {
  async create(professor: Professor): Promise<void> {
    await db.insert(professors).values({
      id: professor.id,
      userId: professor.userId,
      department: professor.department
    })

    await db.insert(professorCourses).values(
      professor.courseIds.map(courseId => ({
        professorId: professor.id,
        courseId
      }))
    )
  }

  async findById(id: string): Promise<Professor | null> {
    const result = await db
      .select()
      .from(professors)
      .where(eq(professors.id, id))

    if (!result.length) return null

    const data = result[0]

    const courses = await db
      .select()
      .from(professorCourses)
      .where(eq(professorCourses.professorId, data.id))

    return Professor.create({
      id: data.id,
      userId: data.userId,
      department: data.department ?? undefined,
      courseIds: courses.map(item => item.courseId)
    })
  }

  async findByUserId(userId: string): Promise<Professor | null> {
    const result = await db
      .select()
      .from(professors)
      .where(eq(professors.userId, userId))

    if (!result.length) return null

    const data = result[0]

    const courses = await db
      .select()
      .from(professorCourses)
      .where(eq(professorCourses.professorId, data.id))

    return Professor.create({
      id: data.id,
      userId: data.userId,
      department: data.department ?? undefined,
      courseIds: courses.map(item => item.courseId)
    })
  }
}