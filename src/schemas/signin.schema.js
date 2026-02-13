import { z } from "zod";

export const signinSchema = z.object({
  email: z
    .string()
    .min(1, "Email or username required"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password should contain Upper & lower letter with numbers & symbols"),

});
