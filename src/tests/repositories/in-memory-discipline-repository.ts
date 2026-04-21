import { Discipline } from "../../domain/discipline/entity/Discipline"
import { DisciplineRepository } from "../../domain/discipline/repository/discipline-repository"

export class InMemoryDisciplineRepository implements DisciplineRepository {
  public items: Discipline[] = []

  async create(discipline: Discipline): Promise<void> {
    this.items.push(discipline)
  }

  async findById(id: string): Promise<Discipline | null> {
    return this.items.find(item => item.id === id) ?? null
  }

  async findByNameAndCourse(name: string, courseId: string): Promise<Discipline | null> {
    return this.items.find(
      item => item.name === name && item.courseId === courseId
    ) ?? null
  }

  async save(discipline: Discipline): Promise<void> {
    const index = this.items.findIndex(item => item.id === discipline.id)

    if (index >= 0) {
      this.items[index] = discipline
    }
  }
}