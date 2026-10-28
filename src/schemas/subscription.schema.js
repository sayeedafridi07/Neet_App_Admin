import { z } from "zod";

const createSubscriptionSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().optional(),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .min(0, "Price cannot be negative"),
  durationInDays: z.coerce
    .number({ invalid_type_error: "Duration must be a number" })
    .int("Duration must be a whole number")
    .min(1, "Duration must be at least 1 day"),
  isActive: z.boolean().default(true),
});

const updateSubscriptionSchema = createSubscriptionSchema.partial();

export { createSubscriptionSchema, updateSubscriptionSchema };
