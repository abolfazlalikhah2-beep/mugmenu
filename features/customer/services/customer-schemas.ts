import { z } from "zod";

export const sendOtpSchema = z.object({
  slug: z.string().min(1),
  phone: z.string().trim().min(10, "شماره موبایل معتبر نیست.").max(20),
});

export const verifyOtpSchema = z.object({
  slug: z.string().min(1),
  phone: z.string().trim().min(10, "شماره موبایل معتبر نیست.").max(20),
  code: z.string().trim().min(1, "کد تایید را وارد کنید.").max(10),
});

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2, "نام و نام خانوادگی را کامل وارد کنید.").max(80),
});

export const addressSchema = z.object({
  title: z.string().trim().min(1, "عنوان آدرس را وارد کنید.").max(40),
  text: z.string().trim().min(5, "آدرس را کامل وارد کنید.").max(500),
  phone: z.string().trim().min(10, "شماره تماس معتبر نیست.").max(20),
  isDefault: z.boolean(),
});
