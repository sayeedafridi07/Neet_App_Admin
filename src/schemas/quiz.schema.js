import { z } from "zod";

const markingSchemeSchema = z.object({
  correct: z.coerce.number().default(4),
  wrong: z.coerce.number().default(-1),
  skipped: z.coerce.number().default(0),
});

const createQuizSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),

  description: z.string().trim().optional(),

  programId: z.string().trim().optional(),

  durationInMinutes: z.coerce
    .number({
      invalid_type_error: "Duration must be a number",
    })
    .min(1, "Duration must be at least 1 minute")
    .default(10),

  markingScheme: markingSchemeSchema.default({}),

  passingMarks: z.coerce
    .number({
      invalid_type_error: "Passing marks must be a number",
    })
    .min(0, "Passing marks cannot be negative")
    .default(0),

  allowRetake: z.boolean().default(false),

  maxAttempts: z.coerce
    .number({
      invalid_type_error: "Max attempts must be a number",
    })
    .min(0, "Max attempts must be at least 0")
    .default(0),

  isActive: z.boolean().default(false),
});

const updateQuizSchema = z.object({
  title: z.string().trim().min(1, "Title is required").optional(),

  description: z.string().trim().optional(),

  programId: z.string().trim().optional(),

  durationInMinutes: z.coerce
    .number({
      invalid_type_error: "Duration must be a number",
    })
    .min(1, "Duration must be at least 1 minute")
    .optional(),

  markingScheme: markingSchemeSchema.partial().optional(),

  passingMarks: z.coerce
    .number({
      invalid_type_error: "Passing marks must be a number",
    })
    .min(0, "Passing marks cannot be negative")
    .optional(),

  allowRetake: z.boolean().optional(),

  maxAttempts: z.coerce
    .number({
      invalid_type_error: "Max attempts must be a number",
    })
    .min(0, "Max attempts must be at least 0")
    .optional(),

  isActive: z.boolean().optional(),
});

const updateQuizStatusSchema = z.object({
  isActive: z.boolean(),
});

export {
  createQuizSchema,
  updateQuizSchema,
  updateQuizStatusSchema,
  markingSchemeSchema,
};
