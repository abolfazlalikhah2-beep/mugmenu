import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, "نام و نام خانوادگی را کامل وارد کنید.").max(80, "نام وارد شده طولانی است."),
  // Loose on purpose, same as auth's phone field — a contact identifier,
  // not a billing field.
  phone: z.string().trim().min(10, "شماره تماس معتبر نیست.").max(20, "شماره تماس معتبر نیست."),
  email: z
    .string()
    .trim()
    .email("ایمیل معتبر نیست.")
    .max(120, "ایمیل وارد شده طولانی است.")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "پیام باید حداقل ۱۰ کاراکتر باشد.")
    .max(2000, "پیام بیش از حد طولانی است."),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
