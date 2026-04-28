CREATE TABLE "professor_courses" (
	"professor_id" text NOT NULL,
	"course_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "professors" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"department" text
);
--> statement-breakpoint
ALTER TABLE "professor_courses" ADD CONSTRAINT "professor_courses_professor_id_professors_id_fk" FOREIGN KEY ("professor_id") REFERENCES "public"."professors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professor_courses" ADD CONSTRAINT "professor_courses_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professors" ADD CONSTRAINT "professors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;