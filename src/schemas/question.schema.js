import { z } from "zod";

const optionSchema = z
  .object({
    text: z.string().trim().optional().default(""),
    image: z.any().optional(),
    _id: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hasText = data.text && data.text.trim().length > 0;
    const hasImage = !!data.image;

    if (!hasText && !hasImage) {
      ctx.addIssue({
        path: ["text"],
        code: z.ZodIssueCode.custom,
        message: "Option must contain text or image",
      });
    }
  });

const createQuestionSchema = z
  .object({
    questionText: z.string().trim().optional().default(""),
    questionImage: z.any().optional(),
    type: z.enum(["single", "multi"]).default("single"),
    options: z
      .array(optionSchema)
      .min(2, "At least 2 options are required")
      .max(6, "Maximum 6 options allowed"),
    correctAnswers: z
      .array(z.number().int().min(0))
      .min(1, "At least one correct answer is required"),
    explanation: z.string().trim().default(""),
    order: z.number().default(0),
    isActive: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    const hasQuestionText = data.questionText && data.questionText.trim().length > 0;
    const hasQuestionImage = !!data.questionImage;

    if (!hasQuestionText && !hasQuestionImage) {
      ctx.addIssue({
        path: ["questionText"],
        code: z.ZodIssueCode.custom,
        message: "Question must contain text or image",
      });
    }

    // Check if index is out of options range
    const hasInvalidIndex = data.correctAnswers.some(
      (i) => i >= data.options.length,
    );
    if (hasInvalidIndex) {
      ctx.addIssue({
        path: ["correctAnswers"],
        code: z.ZodIssueCode.custom,
        message: "Correct answer index is out of options range",
      });
    }

    if (data.type === "single" && data.correctAnswers.length !== 1) {
      ctx.addIssue({
        path: ["correctAnswers"],
        code: z.ZodIssueCode.custom,
        message: "Single type question must have exactly one correct answer",
      });
    }

    if (data.type === "multi" && data.correctAnswers.length < 2) {
      ctx.addIssue({
        path: ["correctAnswers"],
        code: z.ZodIssueCode.custom,
        message: "Multi type question must have at least two correct answers",
      });
    }
  });

const updateQuestionSchema = z
  .object({
    questionText: z.string().trim().optional(),
    questionImage: z.any().optional(),
    type: z.enum(["single", "multi"]).optional(),
    options: z
      .array(optionSchema)
      .min(2, "At least 2 options are required")
      .max(6, "Maximum 6 options allowed")
      .optional(),
    correctAnswers: z.array(z.number().int().min(0)).min(1).optional(),
    explanation: z.string().trim().optional(),
    order: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.questionText !== undefined || data.questionImage !== undefined) {
      const hasQuestionText = data.questionText && data.questionText.trim().length > 0;
      const hasQuestionImage = !!data.questionImage;

      if (!hasQuestionText && !hasQuestionImage) {
        ctx.addIssue({
          path: ["questionText"],
          code: z.ZodIssueCode.custom,
          message: "Question must contain text or image",
        });
      }
    }

    if (data.type && data.correctAnswers) {
      if (data.type === "single" && data.correctAnswers.length !== 1) {
        ctx.addIssue({
          path: ["correctAnswers"],
          code: z.ZodIssueCode.custom,
          message: "Single type question must have exactly one correct answer",
        });
      }

      if (data.type === "multi" && data.correctAnswers.length < 2) {
        ctx.addIssue({
          path: ["correctAnswers"],
          code: z.ZodIssueCode.custom,
          message: "Multi type question must have at least two correct answers",
        });
      }
    }

    // Only check range if both options and correctAnswers are present
    if (data.options && data.correctAnswers) {
      const hasInvalidIndex = data.correctAnswers.some(
        (i) => i >= data.options.length,
      );
      if (hasInvalidIndex) {
        ctx.addIssue({
          path: ["correctAnswers"],
          code: z.ZodIssueCode.custom,
          message: "Correct answer index is out of options range",
        });
      }
    }
  });

const updateStatusSchema = z.object({
  isActive: z.boolean(),
});

export { createQuestionSchema, updateQuestionSchema, updateStatusSchema };
