import { redirect } from "next/navigation";
import { VerifyForm } from "@/components/auth/verify-form";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string; purpose?: string }>;
}) {
  const { phone, purpose } = await searchParams;
  if (!phone) redirect("/register");

  return <VerifyForm phone={phone} purpose={purpose === "reset" ? "reset" : "register"} />;
}
