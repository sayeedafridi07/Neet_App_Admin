import { z } from "zod";

// Mirrors the backend's question validation for chapter quizzes
const quizQuestionSchema = z.object({
  question: z.string().trim().min(1, "Question is required"),

  explanation: z.string().trim().nullable().optional(),

  isActive: z.boolean().optional(),

  options: z
    .array(
      z.object({
        text: z.string().trim().min(1, "Option text is required"),
        isCorrect: z.boolean(),
      }),
    )
    .min(2, "A question must have at least two options")
    .max(6, "A question cannot have more than six options")
    .refine((options) => options.filter((o) => o.isCorrect).length === 1, {
      message: "Mark exactly one option as correct",
    }),
});

export { quizQuestionSchema };
