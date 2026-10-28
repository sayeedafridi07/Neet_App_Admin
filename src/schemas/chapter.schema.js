import { z } from "zod";

const createChapterSchema = z.object({
  name: z.string().trim().min(1, "Chapter name is required"),

  order: z.coerce.number().int().min(1, "Order must be a positive integer"),

  classId: z.uuid("Invalid class ID"),
  subjectId: z.uuid("Invalid subject ID"),
});

const updateChapterSchema = createChapterSchema
  .omit({ classId: true })
  .partial();

export { createChapterSchema, updateChapterSchema };
