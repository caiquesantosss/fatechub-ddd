import { Student } from "@/domain/academic/entity/Student"
import { StudentRepository } from "@/domain/academic/repository/student-repository"
import { RA } from "@/domain/user/values-objects/register-academic"
import { db } from "../database/connection"
import { students } from "../database/schema"
import { eq } from "drizzle-orm"

export class DrizzleStudentRepository implements StudentRepository {

  async create(student: Student): Promise<void> {
    await db.insert(students).values({
      id: student.id,
      userId: student.userId,
      ra: student.ra.getValue(),
      courseId: student.courseId
    })
  }

  async findByUserId(userId: string): Promise<Student | null> {
    const result = await db
      .select()
      .from(students)
      .where(eq(students.userId, userId))

    if (!result.length) return null

    const data = result[0]

    return Student.create({
      id: data.id,
      userId: data.userId,
      ra: RA.create(data.ra),
      courseId: data.courseId
    })
  }

  async findByRA(ra: RA): Promise<Student | null> {
    const result = await db
      .select()
      .from(students)
      .where(eq(students.ra, ra.getValue()))

    if (!result.length) return null

    const data = result[0]

    return Student.create({
      id: data.id,
      userId: data.userId,
      ra: RA.create(data.ra),
      courseId: data.courseId
    })
  }
}