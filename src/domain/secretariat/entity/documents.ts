interface CreateDocumentsProps {
    type: string 
    description: string
}

export class Document {
    private constructor (
        public readonly id: string,
        public type: string,
        public description: string
    ) {}

    static create(props: CreateDocumentsProps) {
        return new Document(
            crypto.randomUUID(), 
            props.type, 
            props.description
        )
    }
}