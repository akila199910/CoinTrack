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

    password: z
        .string()
        .trim()
        .optional()
        .refine((val) => {

            if (val && val.length > 0) {
                return val.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(val);
            }
            return true; 
        }, {
            message: "Password must be at least 8 characters with uppercase, lowercase, and a digit"
        }),

    confirmPassword: z
        .string()
        .trim()
        .optional(),
}).refine((data) => {
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
