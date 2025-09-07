import { z } from "zod";

export const categorySchema = z.object({

    name: z.string().min(1, "Name is required").max(15, "Name must be less than 15 characters"),
    description: z.string().min(1, "Description must be at least 1 character").max(255, "Description must be less than 255 characters").optional(),
    image: z.string().optional(),
    status: z.boolean().optional(),
    type: z.enum(["INCOME", "EXPENSE"]),

})

export type CategorySubmitData = z.infer<typeof categorySchema>;