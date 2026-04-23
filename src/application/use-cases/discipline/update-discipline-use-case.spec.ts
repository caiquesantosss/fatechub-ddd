import { describe, it, expect, beforeEach } from "vitest"
import { InMemoryDisciplineRepository } from "@/tests/repositories/in-memory-discipline-repository"
import { UpdateDisciplineUseCase } from "./update-discipline-use-case"
import { Discipline } from "@/domain/discipline/entity/Discipline"
import { InMemoryProfessorRepository } from "@/tests/repositories/in-memory-professor-repository"
import { Professor } from "@/domain/academic/entity/Professor"

let disciplineRepo: InMemoryDisciplineRepository
let professorRepo: InMemoryProfessorRepository
let sut: UpdateDisciplineUseCase

describe("Update Discipline Use Case", () => {
  beforeEach(() => {
    disciplineRepo = new InMemoryDisciplineRepository()
    professorRepo = new InMemoryProfessorRepository()
    sut = new UpdateDisciplineUseCase(disciplineRepo)
  })

  it("should be able to update a discipline", async () => {

    const professor = Professor.create({
      id: 'prof-1',
      userId: 'user-prof-1',
      department: 'Tecnologia'
    })

    const discipline = Discipline.create({
      name: "Banco de Dados",
      courseId: "course-1",
      professorId: professor.id
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
    const professor = Professor.create({
      id: 'prof-1',
      userId: 'user-prof-1',
      department: 'Tecnologia'
    })

    const discipline = Discipline.create({
      name: "POO",
      courseId: "course-1", 
      professorId: professor.id
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