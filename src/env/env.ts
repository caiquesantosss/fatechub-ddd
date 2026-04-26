import 'dotenv/config'
import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().default(3030),
  JWT_SECRET: z.string()
});

export const env = envSchema.parse(process.env)
export type Env = z.infer<typeof envSchema>