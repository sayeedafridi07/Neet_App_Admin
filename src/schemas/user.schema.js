import { z } from "zod";

export const studentSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid mobile number"),

  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .optional(),

  targetYear: z.number().int().positive().optional(),

  city: z.string().trim().optional(),

  schoolName: z.string().trim().optional(),
});

export const createAdminSchema = z.object({
  email: z.email("Invalid email address"),
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .optional(),
  password: z.string().trim().min(6, "Password must be at least 6 characters"),
});

export const updateAdminSchema = z
  .object({
    email: z.email("Invalid email address"),
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });
