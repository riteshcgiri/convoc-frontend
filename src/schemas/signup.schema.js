import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Full name is required"),

  email: z
    .string()
    .email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password should contain Upper & lower letter with numbers & symbols"),

  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .regex(/^\d+$/, "Phone must contain only numbers"),

  tnc: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must accept terms",
    }),
});
