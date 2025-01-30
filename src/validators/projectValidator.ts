import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(2, "Name must be atleast 2 characters long"),
  description: z
    .string()
    .min(4, "Description must be atleast 4 characters long"),
});

export const updateProjectSchema = z.object({
  name: z.string().min(2, "Name must be atleast 2 characters long"),
  description: z
    .string()
    .min(4, "Description must be atleast 4 characters long"),
  status: z.enum(["PLANNED", "ONGOING", "COMPLETED"]),
});
