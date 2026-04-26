import { User, UserRole } from "@/domain/user/entity/User"
import { UserRepository } from "@/domain/user/repository/user-repository"
import { db } from "../database/connection"
import { users } from "../database/schema"
import { Email } from "@/domain/user/values-objects/email"
import { Password } from "@/domain/user/values-objects/password"
import { eq } from "drizzle-orm"

export class DrizzleUserRepository implements UserRepository {

  async create(user: User): Promise<void> {
    await db.insert(users).values({
      id: user.id,
      name: user.name,
      email: user.email.getValue(),
      password: user.password.getValue(),
      role: user.role,
      status: user.status
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.email, email))

    if (!result.length) return null

    const data = result[0]

    return User.restore({
      id: data.id,
      name: data.name,
      email: Email.create(data.email),
      password: Password.restore(data.password),
      role: data.role as UserRole,
      status: data.status as any
    })
  }

  async save(user: User): Promise<void> {
    await db
      .update(users)
      .set({
        name: user.name,
        password: user.password.getValue(),
        status: user.status
      })
      .where(eq(users.id, user.id))
  }

  async findById(id: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.id, id))

    if (!result.length) return null

    const data = result[0]

    return User.restore({
      id: data.id,
      name: data.name,
      email: Email.create(data.email),
      password: Password.restore(data.password),
      role: data.role as UserRole,
      status: data.status as any
    })
  }

  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
}