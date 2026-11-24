import { z } from "zod";

const createClassSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  order: z.coerce.number().int().min(1, "Order must be a positive integer"),
});

const updateClassSchema = createClassSchema.partial();

export { createClassSchema, updateClassSchema };
