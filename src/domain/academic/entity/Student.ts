import { RA } from "@/domain/user/values-objects/register-academic"

interface CreateStudentProps {
    id: string 
    userId: string
    ra: RA
    courseId: string
}

export class Student {
    private constructor(
        public readonly id: string, 
        public readonly userId: string, 
        public ra: RA, 
        public courseId: string, 
        public semester: number
    ) {}

    static create(props: CreateStudentProps): Student {
        return new Student(
            props.id, 
            props.userId, 
            props.ra, 
            props.courseId, 
            1
        )
    }

    advanceSemester() {
        this.semester += 1
    }
}