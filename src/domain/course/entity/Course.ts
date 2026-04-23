import { randomUUID } from "node:crypto"

interface CreateCourseProps {
    name: string
}

export class Course {
    private constructor(
        public readonly id: string,
        public name: string
    ) { }

    static create(props: CreateCourseProps) {
        if (!props.name || props.name.length < 3) {
            throw new Error('Nome do curso inválido!')
        }

        return new Course(
            randomUUID(),
            props.name
        )
    }

    static restore(props: {
        id: string
        name: string
    }) {
        return new Course(
            props.id,
            props.name
        )
    }
}