import { RegisterProfessorController } from "@/infra/controllers/professor-controller/register-professor-controller";
import { verifyJwt } from "@/infra/middleware/authenticate";
import { FastifyInstance } from "fastify";

export async function professorRoutes(app: FastifyInstance) {
    const cRegisterProfessor = new RegisterProfessorController()

    app.post('/professor/register', 
        { preHandler: [verifyJwt] }, 
        cRegisterProfessor.handle
    )
}