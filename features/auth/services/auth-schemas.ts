import { z } from "zod";

// Loose on purpose (spaces allowed, no country-code gymnastics) — this is a
// contact-and-login identifier, not a billing field.
const phoneSchema = z
  .string()
  .trim()
  .min(10, "شماره تلفن معتبر نیست.")
  .max(20, "شماره تلفن معتبر نیست.");

export const loginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, "رمز عبور را وارد کنید."),
});

export const registerSchema = z
  .object({
    phone: phoneSchema,
    fullName: z.string().trim().min(2, "نام و نام خانوادگی را کامل وارد کنید."),
    password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن یکسان نیستند.",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  phone: phoneSchema,
});

export const verifyOtpSchema = z.object({
  phone: phoneSchema,
  purpose: z.enum(["register", "reset"]),
  code: z.string().trim().min(4, "کد تایید را کامل وارد کنید."),
});

export const changePasswordSchema = z
  .object({
    phone: phoneSchema,
    password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن یکسان نیستند.",
    path: ["confirmPassword"],
  });
