import { UserRepository } from '@domain/user/repository/user-repository'
import { User } from '@domain/user/entity/User'

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = []

  async create(user: User): Promise<void> {
    this.items.push(user)
  }

  async findByEmail(email: string): Promise<User | null> {
    return (
      this.items.find(user =>
        user.email.getValue() === email
      ) ?? null
    )
  }

  async findById(id: string): Promise<User | null> {
    return this.items.find(user => user.id === id) ?? null
  }


  async save(user: User): Promise<void> {
    const index = this.items.findIndex(u =>
      u.id === user.id
    )

    if (index >= 0) {
      this.items[index] = user
    }
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter(user => user.id !== id)
  }
}