import { z } from "zod";

export const registerSchema = z.object({
    firstName: z
        .string({ required_error: "First name is required" })
        .trim()
        .min(1, "First name is required")
        .max(15, "First name must be less than 15 characters")
        .regex(/^[a-zA-Z]+$/, "Only alphabets are allowed"),     

    lastName: z
        .string({ required_error: "Last name is required" })
        .trim()
        .min(1, "Last name is required")
        .max(15, "Last name must be less than 15 characters")
        .regex(/^[a-zA-Z]+$/, "Only alphabets are allowed"),            
    
    name: z
        .string({ required_error: "Name is required" })
        .trim()
        .min(1, "Name is required")
        .max(32, "Name must be less than 32 characters"),     
    
    email: z
        .string({ required_error: "Email address is required" })
        .trim()
        .min(1, "Email address is required")                     
        .email("Enter valid email address"),
    
    contactNumber: z
        .string({ required_error: "Contact number is required" })
        .trim()
        .min(1, "Contact number is required")
        .max(15, "Contact number must be less than 15 characters")
        .regex(/^[0-9]+$/, "Only numbers are allowed"),

    password: z
        .string({ required_error: "Password is required" })
        .trim()
        .min(1,"Password is required")
        .min(8, "Must be at least 8 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
            "Include upper, lower, and a digit"
        ),

    active: z
        .boolean({ required_error: "Active is required" }),
});

export type RegisterSubmitData = z.infer<typeof registerSchema>;
