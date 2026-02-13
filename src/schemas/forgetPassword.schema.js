import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(3, "Email or Username is required"),
});
