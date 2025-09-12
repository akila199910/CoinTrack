import { z } from "zod";

export const profileUpdateSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, "First name is required")
        .max(15, "First name must be less than 15 characters")
        .regex(/^[a-zA-Z]+$/, "Only alphabets are allowed"),     

    lastName: z
        .string()
        .trim()
        .min(1, "Last name is required")
        .max(15, "Last name must be less than 15 characters")
        .regex(/^[a-zA-Z]+$/, "Only alphabets are allowed"),            
    
    email: z
        .string()
        .trim()
        .min(1, "Email address is required")                     
        .email("Enter valid email address"),
    
    contactNumber: z
        .string()
        .trim()
        .min(1, "Contact number is required")
        .max(15, "Contact number must be less than 15 characters")
        .regex(/^[0-9]+$/, "Only numbers are allowed"),
});

export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
