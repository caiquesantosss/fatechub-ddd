interface CreateProfessorProps {
    id: string 
    userId: string
    department?: string
}

export class Professor {
    public readonly id: string 
    public readonly userId: string 
    public readonly department?: string

    private constructor(props: CreateProfessorProps) {
        this.id = props.id
        this.userId = props.userId
        this.department = props.department
    }

    static create(props: CreateProfessorProps): Professor {
        return new Professor(props)
    }
}