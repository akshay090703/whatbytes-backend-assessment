import { z } from "zod";

export const userChangeSchema = z.object({
  name: z.string().min(2, "Name must be atleast 2 characters long"),
  email: z.string().email("Invalid email"),
});
