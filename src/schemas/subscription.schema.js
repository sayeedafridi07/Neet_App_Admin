import { z } from "zod";

// Form values are in rupees; convert with toPaise() before sending to the API.
const emptyToNull = (v) => (v === "" || v === undefined ? null : v);

const subscriptionPlanSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    description: z.string().trim().optional(),
    price: z.coerce
      .number({ invalid_type_error: "Price must be a number" })
      .min(0, "Price cannot be negative"),
    originalPrice: z.preprocess(
      emptyToNull,
      z.coerce
        .number({ invalid_type_error: "Original price must be a number" })
        .min(0, "Original price cannot be negative")
        .nullable(),
    ),
    durationDays: z.coerce
      .number({ invalid_type_error: "Duration must be a number" })
      .int("Duration must be a whole number")
      .min(1, "Duration must be at least 1 day"),
    features: z.array(z.string().trim().min(1)).default([]),
    order: z.coerce
      .number({ invalid_type_error: "Order must be a number" })
      .int("Order must be a whole number")
      .min(0, "Order cannot be negative")
      .default(0),
  })
  .refine(
    (data) => data.originalPrice === null || data.originalPrice >= data.price,
    {
      message: "Original price must be at least the price",
      path: ["originalPrice"],
    },
  );

const toPaise = (rupees) => Math.round(Number(rupees) * 100);
const toRupees = (paise) => (paise ?? 0) / 100;

export { subscriptionPlanSchema, toPaise, toRupees };
