import { z } from "zod";

export const profileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name is required")
    .max(10, "Max 10 characters")
    .regex(/^[a-zA-Z\u0600-\u06FF\s]+$/, "Letters only"),

  lastName: z
    .string()
    .min(2, "Last name is required")
    .max(10, "Max 10 characters")
    .regex(/^[a-zA-Z\u0600-\u06FF\s]+$/, "Letters only"),

  email: z.string().min(1, "Email is required").email("Invalid email format"),
});

export type ProfileFields = z.infer<typeof profileSchema>;

const passwordRules = z
  .string()
  .min(8, "Minimum 8 characters")
  .regex(/[A-Z]/, "Must contain uppercase letter")
  .regex(/[a-z]/, "Must contain lowercase letter")
  .regex(/\d/, "Must contain a number")
  .regex(/[@$!%*?&_\-#]/, "Must contain a special character");

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordRules,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export type ChangePasswordFields = z.infer<typeof changePasswordSchema>;
