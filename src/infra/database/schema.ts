import { pgTable, text } from 'drizzle-orm/pg-core'

// =======================
// USERS
// =======================
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull(),
  status: text('status').notNull()
})

// =======================
// COURSES
// =======================
export const courses = pgTable('courses', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique()
})

// =======================
// STUDENTS
// =======================
export const students = pgTable('students', {
  id: text('id').primaryKey(),

  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  ra: text('ra').notNull().unique(),

  courseId: text('course_id')
    .notNull()
    .references(() => courses.id, { onDelete: 'restrict' })
})