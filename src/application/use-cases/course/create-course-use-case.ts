import { Either, left, right } from "@/core/either"
import { Course } from "@/domain/course/entity/Course"
import { CourseRepository } from "@/domain/course/repository/course-repository"
import { User, UserRole } from "@/domain/user/entity/User"

interface CreateCourseRequest {
  user: User
  name: string
}

type CreateCourseResponse = Either<
  Error,
  {
    course: Course
  }
>

export class CreateCourseUseCase {
  constructor(
    private courseRepository: CourseRepository
  ) { }

  async execute({
    user,
    name
  }: CreateCourseRequest): Promise<CreateCourseResponse> {

    if (user.role !== UserRole.COORDINATOR) {
      return left(new Error("Apenas coordenadores podem criar cursos"))
    }

    const existing = await this.courseRepository.findByName(name)

    if (existing) {
      return left(new Error("Esse curso já existe!"))
    }

    let course: Course

    try {
      course = Course.create({ name })
    } catch (error) {
      return left(error as Error)
    }

    await this.courseRepository.create(course)

    return right({ course })
  }
}