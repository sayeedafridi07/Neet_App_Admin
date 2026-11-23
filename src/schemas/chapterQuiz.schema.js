import { z } from "zod";

// Empty input must fail, not coerce to 0
const marks = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.coerce
    .number({ error: "Marks are required" })
    .int("Marks must be a whole number"),
);

const createChapterQuizSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),

  description: z.string().trim().min(1).optional(),

  durationMinutes: z.coerce
    .number()
    .int()
    .min(1, "Duration must be a positive number of minutes")
    .optional(),

  correctMarks: marks,
  wrongMarks: marks,
  skippedMarks: marks,

  isActive: z.boolean().optional(),

  chapterId: z.uuid("Invalid chapter ID"),
});

const updateChapterQuizSchema = createChapterQuizSchema
  .omit({ chapterId: true })
  .partial()
  // Empty string clears the description on update
  .extend({ description: z.string().trim().optional() });

// Test series are timed, so duration is required
const testSeriesDuration = z.coerce
  .number({ error: "Duration is required" })
  .int()
  .min(1, "Duration must be a positive number of minutes");

// Test series quizzes are standalone, so no chapterId
const createTestSeriesQuizSchema = createChapterQuizSchema
  .omit({ chapterId: true })
  .extend({ durationMinutes: testSeriesDuration });

const updateTestSeriesQuizSchema = updateChapterQuizSchema.extend({
  durationMinutes: testSeriesDuration,
});

export {
  createChapterQuizSchema,
  createTestSeriesQuizSchema,
  updateChapterQuizSchema,
  updateTestSeriesQuizSchema,
};
