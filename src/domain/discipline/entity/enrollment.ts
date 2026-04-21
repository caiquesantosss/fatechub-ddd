import { Grade, GradeType } from "../values-objects/grade";

interface CreateEnrollmentProps {
    studentId: string,
    disciplineId: string
}

export class Enrollment {
    private constructor(
        public readonly id: string,
        public studentId: string,
        public disciplineId: string,
        public grades: Grade[],
        public attendance?: number
    ) { }

    static create(props: CreateEnrollmentProps): Enrollment {
        return new Enrollment(
            crypto.randomUUID(),
            props.studentId,
            props.disciplineId,
            []
        )
    }

    addGrade(grade: Grade) {
        const exists = this.grades.find(g => g.type === grade.type)

        if (exists) {
            throw new Error(`Nota ${grade.type} já existe`)
        }

        this.grades.push(grade)
    }

    getGrade(type: GradeType): number {
        const grade = this.grades.find(g => g.type === type)

        if (!grade) {
            throw new Error(`Nota ${type} não encontrada`)
        }

        return grade.value
    }

    updateGrade(type: GradeType, value: number) {
        const grade = this.grades.find(g => g.type === type)

        if (!grade) {
            throw new Error(`Nota ${type} não encontrada`)
        }

        const updated = Grade.create(type, value)

        this.grades = this.grades.map(g =>
            g.type === type ? updated : g
        )
    }

    updateAttendance(attendance: number) {
        if (attendance < 0 || attendance > 100) {
            throw new Error('Frequência inválida')
        }

        this.attendance = attendance
    }
}