import { Either, left, right } from "../../../core/either"
import { Email } from "../values-objects/email"
import { Password } from "../values-objects/password"

export enum UserRole {
  STUDENT = "student",
  PROFESSOR = "professor",
  SECRETARY = "secretary",
  COORDINATOR = "coordinator"
}

export type UserStatus = "active" | "inactive"

interface CreateUserProps {
  name: string
  email: Email
  password: Password
  role: UserRole
}

export class User {
  private constructor(
    public readonly id: string,
    public name: string,
    public email: Email,
    public password: Password,
    public role: UserRole,
    public status: UserStatus,
  ) {}

  static create(props: CreateUserProps): Either<Error, User> {

    // Correção, desaclopamento de aluno do usuário. 

    const user = new User(
      crypto.randomUUID(),
      props.name,
      props.email,
      props.password,
      props.role,
      "active",
    )

    return right(user)
  }

  disable() {
    if (this.status === 'inactive') {
      throw new Error('Usuário já está desativado!')
    }

    this.status = 'inactive'
  }

  activate() {
    if (this.status === 'active') {
      throw new Error('Usuário já está ativo')
    }

    this.status = 'active'
  }
}