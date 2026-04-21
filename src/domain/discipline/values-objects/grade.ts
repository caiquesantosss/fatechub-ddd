export type GradeType = 'B1' | 'B2' | 'B3'

export class Grade {
    private constructor(
        public readonly type: GradeType,
        public readonly value: number
    ) { }

    static create(type: GradeType, value: number): Grade {
        if (value < 0 || value > 10) {
            throw new Error('Nota deve estar entre 0 e 10')
        }

        return new Grade(type, value)
    }
} 