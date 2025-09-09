import { z } from "zod";

export const transactionSchema = z.object({
  amount: z
    .string({ error: "Amount is required" })
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Amount must be a number with up to 2 decimals")
    .transform((v) => Number(v))
    .refine((v) => v >= 1, "Amount must be at least 1"),

  description: z
    .string()
    .trim()
    .max(255, "Description must be less than 255 characters")
    .optional(),

  date: z
    .string({ error: "Date is required" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .refine((s) => {
      const [y, m, d] = s.split("-").map(Number);
      const dt = new Date(`${s}T00:00:00Z`);
      return (
        dt.getUTCFullYear() === y &&
        dt.getUTCMonth() + 1 === m &&
        dt.getUTCDate() === d
      );
    }, "Date is invalid"),

  status: z.string().transform((v) => v === "true").optional(),

  category_id: z.string().transform((v) => Number(v)).refine((v) => v > 0, "Category is required"),

});

export type TransactionSubmitData = z.infer<typeof transactionSchema>;