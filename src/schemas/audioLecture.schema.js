import { z } from "zod";

const createAudioLectureSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),

  // Always sent; empty string means no description
  description: z.string().trim(),

  // duration: z.coerce
  //   .number()
  //   .int()
  //   .min(1, "Duration must be a positive number of seconds"),

  order: z.coerce
    .number()
    .int()
    .min(1, "Sort order must be a positive integer"),

  isActive: z.boolean().optional(),

  chapterId: z.uuid("Invalid chapter ID"),
});

const updateAudioLectureSchema = createAudioLectureSchema
  .omit({ chapterId: true })
  .partial()
  // Always sent; empty string clears the description
  .required({ description: true });

export { createAudioLectureSchema, updateAudioLectureSchema };
