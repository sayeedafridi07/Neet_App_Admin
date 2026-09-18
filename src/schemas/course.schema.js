const { z } = require("zod");

const createCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters").optional(),
  imageLink: z
    .string()
    .url("Image link must be a valid URL")
    .optional(),

  order: z
    .number({
      invalid_type_error: "Order must be a number",
    })
    .int()
    .positive()
    .optional(),
});

const updateCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  description: z.string().min(3, "Description must be at least 3 characters").optional(),
  imageLink: z
    .string()
    .url("Image link must be a valid URL")
    .optional(),

  order: z
    .number({
      invalid_type_error: "Order must be a number",
    })
    .int()
    .positive()
    .optional(),
});

const updateCourseStatusSchema = z.object({
  isActive: z.boolean(),
});

module.exports = {
  createCourseSchema,
  updateCourseSchema,
  updateCourseStatusSchema,
};