import "server-only";
import bcrypt from "bcryptjs";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";
import * as userRepository from "@/features/auth/repositories/user-repository";
import { createSession } from "@/features/auth/services/session-service";
import { sendOtp, verifyOtp as verifyOtpCode, OtpRateLimitError } from "@/features/auth/services/otp-service";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  changePasswordSchema,
} from "@/features/auth/services/auth-schemas";

export type ServiceResult = { ok: true } | { ok: false; error: string };

const LOGIN_ATTEMPT_LIMIT = { limit: 5, windowMs: 15 * 60 * 1000 };

export async function login(input: unknown): Promise<ServiceResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const { phone, password } = parsed.data;

  const { allowed } = checkRateLimit(`login:${phone}`, LOGIN_ATTEMPT_LIMIT);
  if (!allowed) {
    logger.warn("auth.login_rate_limited", { phone });
    return { ok: false, error: "تعداد تلاش‌های ورود بیش از حد مجاز است. کمی بعد دوباره تلاش کنید." };
  }

  const user = await userRepository.findUserByPhone(phone);

  // TEMPORARY — debugging a production login failure for a real (non-demo)
  // user report. Never logs the full hash or the plaintext password. Remove
  // once the root cause is found.
  logger.info("auth.login_debug", {
    phone,
    userFound: Boolean(user),
    passwordHashLength: user?.passwordHash.length ?? null,
    passwordHashPrefix: user?.passwordHash.slice(0, 4) ?? null,
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    logger.info("auth.login_failed", { phone });
    return { ok: false, error: "شماره تلفن یا رمز عبور اشتباه است." };
  }
  if (!user.isActive) {
    logger.info("auth.login_blocked_inactive", { phone });
    return { ok: false, error: "این حساب غیرفعال شده است." };
  }

  await createSession(user.phone);
  await userRepository.recordLogin(user.phone);
  logger.info("auth.login_succeeded", { phone });
  return { ok: true };
}

export async function register(input: unknown): Promise<ServiceResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const { phone, fullName, password } = parsed.data;

  const existing = await userRepository.findUserByPhone(phone);
  if (existing) {
    return { ok: false, error: "این شماره قبلاً ثبت‌نام کرده است." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await userRepository.createUser({ phone, fullName, passwordHash });
  logger.info("auth.registered", { phone });

  // TODO: gate the account as unverified until the OTP is actually checked,
  // once a real SMS provider is connected.
  try {
    await sendOtp(phone, "REGISTER");
  } catch (e) {
    if (e instanceof OtpRateLimitError) return { ok: false, error: e.message };
    throw e;
  }
  return { ok: true };
}

export async function forgotPassword(input: unknown): Promise<ServiceResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  try {
    await sendOtp(parsed.data.phone, "RESET");
  } catch (e) {
    if (e instanceof OtpRateLimitError) return { ok: false, error: e.message };
    throw e;
  }
  return { ok: true };
}

export async function verifyOtp(
  input: unknown
): Promise<ServiceResult & { purpose?: "register" | "reset" }> {
  const parsed = verifyOtpSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const { phone, purpose, code } = parsed.data;

  const isValid = await verifyOtpCode(phone, purpose === "reset" ? "RESET" : "REGISTER", code);
  if (!isValid) {
    return { ok: false, error: "کد تایید نامعتبر یا منقضی شده است." };
  }

  if (purpose === "reset") {
    logger.info("auth.verified", { phone, purpose });
    return { ok: true, purpose: "reset" };
  }
  await createSession(phone);
  logger.info("auth.verified", { phone, purpose });
  return { ok: true, purpose: "register" };
}

export async function changePassword(input: unknown): Promise<ServiceResult> {
  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const { phone, password } = parsed.data;

  const passwordHash = await bcrypt.hash(password, 10);
  await userRepository.updatePasswordByPhone(phone, passwordHash).catch((e) => {
    logger.warn("auth.change_password_no_such_user", { phone, error: String(e) });
  });
  logger.info("auth.password_changed", { phone });
  return { ok: true };
}
