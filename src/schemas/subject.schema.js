import { z } from "zod";

const createSubjectSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
});

const updateSubjectSchema = createSubjectSchema.partial();

export { createSubjectSchema, updateSubjectSchema };
