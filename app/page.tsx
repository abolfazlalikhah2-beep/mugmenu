import { redirect } from "next/navigation";
import { getSession } from "@/features/auth/services/session-service";
import { findUserByPhone } from "@/features/auth/repositories/user-repository";

export default async function Home() {
  const session = await getSession();
  if (!session) redirect("/style-guide");

  const user = await findUserByPhone(session.phone);
  redirect(user?.businessId ? "/dashboard" : "/onboarding");
}
