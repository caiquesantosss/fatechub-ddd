import { AssignProfessorToCourseController } from "@/infra/controllers/professor-controller/assign-professor-to-course-controller";
import { RegisterProfessorController } from "@/infra/controllers/professor-controller/register-professor-controller";
import { verifyJwt } from "@/infra/middleware/authenticate";
import { FastifyInstance } from "fastify";

export async function professorRoutes(app: FastifyInstance) {
    const cRegisterProfessor = new RegisterProfessorController()
    const cAssignProfessorToCourseController = new AssignProfessorToCourseController()

    app.post('/professor/register',
        { preHandler: [verifyJwt] },
        cRegisterProfessor.handle
    )

    app.post(
        "/professors/courses",
        { preHandler: [verifyJwt] },
        cAssignProfessorToCourseController.handle
    )
}