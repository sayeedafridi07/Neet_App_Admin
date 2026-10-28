import { z } from "zod";

const marks = z.coerce.number().int("Marks must be a whole number");

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

export { createChapterQuizSchema, updateChapterQuizSchema };
