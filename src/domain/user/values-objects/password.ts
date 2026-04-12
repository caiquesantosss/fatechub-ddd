export class Password {
  private constructor(private readonly value: string) {}

  static create(password: string): Password {
    if (password.length < 6) {
      throw new Error("Senha muito curta")
    }
    return new Password(password)
  }

  getValue() {
    return this.value
  }

  equals(other: Password): boolean {
    return this.value === other.value
  }
}