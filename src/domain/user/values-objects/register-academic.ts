interface RAProps {
  value: string
}

export class RA {
  private readonly value: string;

  private constructor(props: RAProps) {
    this.value = props.value
  }

  public static create(value: string): RA {
    RA.validate(value);
    return new RA({ value })
  }

  private static validate(ra: string) {
    if (!ra) {
      throw new Error('RA é obrigatório');
    }

    const isValid = /^\d{8,12}$/.test(ra)

    if (!isValid) {
      throw new Error('RA inválido')
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: RA): boolean {
    return this.value === other.value;
  }
}