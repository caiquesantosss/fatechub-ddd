interface CreateDisciplineProps {
  name: string
  courseId: string
}

export class Discipline {
  private constructor(
    public readonly id: string,
    public name: string,
    public courseId: string,
    public professorId?: string
  ) {}

  static create(props: CreateDisciplineProps) {
    return new Discipline(
      crypto.randomUUID(),
      props.name,
      props.courseId
    )
  }

  assignProfessor(professorId: string) {
    this.professorId = professorId
  }
}