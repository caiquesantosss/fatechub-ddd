import { pgTable, text } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull(),
  status: text('status').notNull()
})

export const students = pgTable('students', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    ra: text('ra').notNull().unique(),
    courseId: text('course_id').notNull()
})