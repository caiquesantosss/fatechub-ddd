import { describe, it, expect, beforeEach } from "vitest"
import { InMemoryDisciplineRepository } from "@/tests/repositories/in-memory-discipline-repository"
import { UpdateDisciplineUseCase } from "./update-discipline-use-case"
import { Discipline } from "@/domain/discipline/entity/Discipline"

let disciplineRepo: InMemoryDisciplineRepository
let sut: UpdateDisciplineUseCase

describe("Update Discipline Use Case", () => {
  beforeEach(() => {
    disciplineRepo = new InMemoryDisciplineRepository()
    sut = new UpdateDisciplineUseCase(disciplineRepo)
  })

  it("should be able to update a discipline", async () => {
    const discipline = Discipline.create({
      name: "Banco de Dados",
      courseId: "course-1"
    })

    await disciplineRepo.create(discipline)

    const result = await sut.execute({
      disciplineId: discipline.id,
      name: "Banco de Dados II"
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.discipline.name).toBe("Banco de Dados II")
      expect(disciplineRepo.items[0].name).toBe("Banco de Dados II")
    }
  })

  it("should be able to update courseId", async () => {
    const discipline = Discipline.create({
      name: "POO",
      courseId: "course-1"
    })

    await disciplineRepo.create(discipline)

    const result = await sut.execute({
      disciplineId: discipline.id,
      courseId: "course-2"
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.discipline.courseId).toBe("course-2")
    }
  })

  it("should not update non-existing discipline", async () => {
    const result = await sut.execute({
      disciplineId: "non-existing-id",
      name: "Nova disciplina"
    })

    expect(result.isLeft()).toBe(true)
  })
})