export type RequestStatus = | 'pendente' | 'aprovada' | 'rejeitada'

interface CreateRequestProps {
    studentId: string
    documentId: string
}

export class Request {
    private constructor(
        public readonly id: string,
        public studentId: string,
        public documentId: string,
        public status: RequestStatus,
        public createdAt: Date,
        public updatedAt?: Date
    ) { }

    static create(props: CreateRequestProps) {
        return new Request(
            crypto.randomUUID(),
            props.studentId,
            props.documentId,
            'pendente',
            new Date()
        )
    }

    approve() {
        if (this.status !== 'pendente') {
            throw new Error('Só pode aprovar se estiver pendente')
        }

        this.status = 'aprovada'
        this.updatedAt = new Date()
    }

    reject() {
        if (this.status !== 'pendente') {
            throw new Error('Só pode rejeitar se estiver pendente')
        }

        this.status = 'rejeitada'
        this.updatedAt = new Date()
    }
}