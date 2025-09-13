import { z } from "zod";

export const categorySchema = z.object({

    name: z.string().min(1, "Name is required").max(15, "Name must be less than 15 characters"),
    description: z.string().min(1, "Description must be at least 1 character").max(255, "Description must be less than 255 characters").optional(),
    image: z.string().optional(),
    status: z.boolean().optional(),
    type: z.enum(["INCOME", "EXPENSE", "SAVINGS"]),
})

export const updateCategorySchema = z.object({
    id: z.string().transform((v) => Number(v)).refine((v) => v > 0, "Id is required"),
    name: z.optional(z.string().min(1, "Name is required").max(15, "Name must be less than 15 characters")),
    description: z.optional(z.string().min(1, "Description must be at least 1 character").max(255, "Description must be less than 255 characters")),
    image: z.optional(z.string()),
    status: z.optional(z.boolean()),
    type: z.optional(z.enum(["INCOME", "EXPENSE", "SAVINGS"])),
})

export type CategorySubmitData = z.infer<typeof categorySchema>;
export type UpdateCategorySubmitData = z.infer<typeof updateCategorySchema>;