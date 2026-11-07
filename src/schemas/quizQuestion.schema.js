import { z } from "zod";

// Mirrors the backend's question validation for chapter quizzes
const quizQuestionSchema = z.object({
  question: z.string().trim().min(1, "Question is required"),

  explanation: z.string().trim().nullable().optional(),

  isActive: z.boolean().optional(),

  options: z
    .array(
      z
        .object({
          // Existing option id, so the backend can keep its saved image
          id: z.string().optional(),
          text: z.string().trim(),
          isCorrect: z.boolean(),
          removeImage: z.boolean().optional(),
          // Form-only flag: an image can stand in for the text
          hasImage: z.boolean().optional(),
        })
        .refine((option) => option.text || option.hasImage, {
          message: "Add option text or an image",
          path: ["text"],
        }),
    )
    .min(2, "A question must have at least two options")
    .max(6, "A question cannot have more than six options")
    .refine((options) => options.filter((o) => o.isCorrect).length === 1, {
      message: "Mark exactly one option as correct",
    }),
});

export { quizQuestionSchema };
