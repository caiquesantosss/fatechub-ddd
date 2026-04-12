import { StudentRepository } from "@domain/academic/repository/student-repository"
import { Student } from "@/domain/academic/entity/Student"
import { RA } from "@domain/user/values-objects/register-academic"

export class InMemoryStudentRepository implements StudentRepository {
  public items: Student[] = []

  async create(student: Student): Promise<void> {
    this.items.push(student)
  }

  async findByUserId(userId: string): Promise<Student | null> {
    return this.items.find(s => s.userId === userId) ?? null
  }

  async findByRA(ra: RA): Promise<Student | null> {
    return (
      this.items.find(s =>
        s.ra.getValue() === ra.getValue()
      ) ?? null
    )
  }
}