export class Email {
  private constructor(private readonly value: string) {}

  static create(email: string): Email {
    const normalized = email.trim().toLowerCase()

    if (!this.isValid(normalized)) {
      throw new Error("Email inválido")
    }

    return new Email(normalized)
  }

  private static isValid(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  getValue(): string {
    return this.value
  }

  toString(): string {
    return this.value
  }

  equals(other: Email): boolean {
    return this.value === other.value
  }
}