import { z } from "zod";

const emptyToUndefined = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

export const settingsSchema = z
  .object({
    password: z.preprocess(
      emptyToUndefined,
      z.string().min(8, "Password must be at least 8 characters").optional()
    ),
    confirmPassword: z.preprocess(
      emptyToUndefined,
      z.string().min(8, "Confirm password must be at least 8 characters").optional()
    ),
  })
  .superRefine((data, ctx) => {
    const hasPassword = data.password !== undefined;
    const hasConfirm = data.confirmPassword !== undefined;

    // If one is present, the other must be present
    if (hasPassword !== hasConfirm) {
      if (!hasPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "Password is required when confirm password is provided.",
        });
      }
      if (!hasConfirm) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["confirmPassword"],
          message: "Confirm password is required when password is provided.",
        });
      }
      return;
    }

    // If both present, they must match
    if (hasPassword && data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords must match.",
      });
    }
  });

export type SettingsSubmitData = z.infer<typeof settingsSchema>;
