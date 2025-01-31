import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "title should not exceed 255."),
  description: z.string().min(6, "Description should be atleast 6 characters"),
  assignedUserId: z.string().min(1, "Assigned user id is required"),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "title should not exceed 255."),
  description: z.string().min(6, "Description should be atleast 6 characters"),
  assignedUserId: z.string().min(1, "Assigned user id is required"),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
});
