import { z } from "zod";

const createResultSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  examDate: z.coerce.date({
    invalid_type_error: "Exam date must be a valid date",
  }).optional(),
  order: z.coerce
    .number({
      invalid_type_error: "Order must be a number",
    })
    .int()
    .positive()
    .optional(),
});

const updateResultSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  examDate: z.coerce.date({
    invalid_type_error: "Exam date must be a valid date",
  }).optional(),
  order: z.coerce
    .number({
      invalid_type_error: "Order must be a number",
    })
    .int()
    .positive()
    .optional(),
});

const updateResultStatusSchema = z.object({
  isActive: z.boolean({
    required_error: "isActive is required",
    invalid_type_error: "isActive must be a boolean",
  }),
});

const uploadResultSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
  file: z.any().refine((val) => val !== null && val !== undefined && val !== "", "Image is required"),
});

const updateUploadResultSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters").optional(),
  file: z.any().refine((val) => val !== null && val !== undefined && val !== "", "Image is required"),
});

export {
  createResultSchema,
  updateResultSchema,
  updateResultStatusSchema,
  uploadResultSchema,
  updateUploadResultSchema,
};
