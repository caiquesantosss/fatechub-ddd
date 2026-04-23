interface CreateDisciplineProps {
  name: string
  courseId: string
  professorId: string
}

export class Discipline {
  private constructor(
    public readonly id: string,
    public name: string,
    public courseId: string,
    public professorId: string
  ) {}

  static create(props: CreateDisciplineProps) {
    return new Discipline(
      crypto.randomUUID(),
      props.name,
      props.courseId,
      props.professorId
    )
  }

  assignProfessor(professorId: string) {
    if (this.professorId) {
        throw new Error('Disciplina já possui um professor.')
    }

    this.professorId = professorId
  }
}