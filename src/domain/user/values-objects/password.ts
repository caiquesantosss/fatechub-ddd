import bcrypt from "bcryptjs"

export class Password {
  private constructor(private readonly value: string) {}

  // 🔥 entrada do usuário (senha crua)
  static async create(password: string): Promise<Password> {
    if (password.length < 6) {
      throw new Error("Senha muito curta")
    }

    const hashed = await bcrypt.hash(password, 10)

    return new Password(hashed)
  }

  static restore(hashedPassword: string): Password {
    return new Password(hashedPassword)
  }

  async compare(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.value)
  }

  getValue(): string {
    return this.value
  }

  toString(): string {
    return this.value
  }
}