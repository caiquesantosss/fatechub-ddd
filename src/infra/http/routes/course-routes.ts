import { CreateCourseController } from "@/infra/controllers/courses-controller/create-course-controller";
import { verifyJwt } from "@/infra/middleware/authenticate";
import { FastifyInstance } from "fastify";

export async function courseRoutes(app: FastifyInstance) {
    const cCreateCourse = new CreateCourseController() 

    app.post('/courses', { preHandler: [verifyJwt] }, cCreateCourse.handle)
}