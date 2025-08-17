import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email address is required" })
    .trim()
    .min(1, "Email address is required")                     
    .email("Enter valid email address"),   
    
  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(1,"Password is required")
    .min(8, "Must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      "Include upper, lower, and a digit"
    ),
});

export type LoginSubmitData = z.infer<typeof loginSchema>;
