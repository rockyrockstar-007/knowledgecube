import { relations } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";

export const courses = pgTable("courses", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    imageSrc: text("image_src").notNull(),
});

export const coursesRelations = relations(courses, ({ many }) => ({
    userProgress: many(userProgress),
    units: many(units),
}));

export const units = pgTable("units", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    courseId: integer("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
    order: integer("order").notNull()
});

export const unitsRelations = relations(units, ({ one, many }) => ({
    courses: one(courses, {
        fields: [units.courseId],
        references: [courses.id]
    }),
    lessons: many(lessons)
}));

export const lessons = pgTable("lessons", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    unitId: integer("unit_id").references(() => units.id, { onDelete: "cascade" }).notNull(),
    order: integer("order").notNull()
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
    units: one(units, {
        fields: [lessons.unitId],
        references: [units.id]
    }),
    challenges: many(challenges)
}));

export const challengesEnum = pgEnum("type", ["SELECT", "ASSIST"]);

export const challenges = pgTable("challenges", {
    id: serial("id").primaryKey(),
    lessonId: integer("lesson_id").references(() => lessons.id, { onDelete: "cascade" }).notNull(),
    type: challengesEnum("type").notNull(),
    question: text("question").notNull(),
    order: integer("order").notNull(),
});

export const challengesRelations = relations(challenges, ({ one, many }) => ({
    lessons: one(lessons, {
        fields: [challenges.lessonId],
        references: [lessons.id]
    }),
    challengesOptions: many(challengesOptions),
    challengeProgress: many(challengeProgress),
}));

export const challengesOptions = pgTable("challengesOptions", {
    id: serial("id").primaryKey(),
    type: challengesEnum("type").notNull(),
    challengeId: integer("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
    text: text("text").notNull(),
    correct: boolean("correct").notNull(),
    audioSrc: text("audio_src"),
    imageSrc: text("image_src")
});

export const challengesOptionsRelations = relations(challengesOptions, ({ one }) => ({
    challenge: one(challenges, {
        fields: [challengesOptions.challengeId],
        references: [challenges.id]
    })
}));

export const challengeProgress = pgTable("challengeProgress", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    challengeId: integer("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
    completed: boolean("completed").notNull().default(false),
});

export const challengeProgressRelations = relations(challengeProgress, ({ one }) => ({
    challenge: one(challenges, {
        fields: [challengeProgress.challengeId],
        references: [challenges.id]
    })
}));

export const userProgress = pgTable("user_progress", {
    userId: text("user_id").primaryKey(),
    userName: text("user_name").notNull().default("User"),
    userImageSrc: text("user_image_src").notNull().default("/lingo-logo.png"), // TODO: change this to some user default photo
    activeCourseId: integer("active_course_id").references(() => courses.id, { onDelete: "cascade" }),
    hearts: integer("hearts").notNull().default(5),
    points: integer("points").notNull().default(0),
});

export const userProgressRelations = relations(userProgress, ({ one }) => ({
    activeCourse: one(courses, {
        fields: [userProgress.activeCourseId],
        references: [courses.id]
    }),
}));