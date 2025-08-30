import { z } from "zod";

export const profileUpdateSchema = z.object({
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
        .string()
        .trim()
        .min(8, "Must be at least 8 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
            "Include upper, lower, and a digit"
        )
        .optional(),

    confirmPassword: z
        .string()
        .trim()
        .optional(),
}).refine((data) => {
    // If password is provided, confirmPassword is required
    if (data.password && !data.confirmPassword) {
        return false;
    }
    return true;
}, {
    message: "Confirm password is required when password is provided",
    path: ["confirmPassword"],
}).refine((data) => {
    // If confirmPassword is provided, password is required
    if (data.confirmPassword && !data.password) {
        return false;
    }
    return true;
}, {
    message: "Password is required when confirm password is provided",
    path: ["password"],
}).refine((data) => {
    // If both password and confirmPassword are provided, they must match
    if (data.password && data.confirmPassword) {
        return data.password === data.confirmPassword;
    }
    return true;
}, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
