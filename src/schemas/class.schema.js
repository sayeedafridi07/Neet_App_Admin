import { z } from "zod";

const createClassSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
});

const updateClassSchema = createClassSchema.partial();

export { createClassSchema, updateClassSchema };
