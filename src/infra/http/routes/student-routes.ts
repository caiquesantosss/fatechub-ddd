import { RegisterStudentController } from "@/infra/controllers/student-controller/register-student-controller";
import { verifyJwt } from "@/infra/middleware/authenticate";
import { FastifyInstance } from "fastify";

export async function studentRoutes(app: FastifyInstance) {
    const cRegisterStudent = new RegisterStudentController()

    app.post('/students/register', 
        { preHandler: [verifyJwt] }, 
        cRegisterStudent.handle
    )
}