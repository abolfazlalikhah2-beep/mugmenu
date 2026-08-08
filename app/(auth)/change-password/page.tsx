import { ChangePasswordForm } from "@/components/auth/change-password-form";

export default async function ChangePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string }>;
}) {
  const { phone } = await searchParams;
  return <ChangePasswordForm phone={phone} />;
}
