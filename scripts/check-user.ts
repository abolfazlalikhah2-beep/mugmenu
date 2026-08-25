import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const PHONE = "09120000010";

async function main() {
  const user = await prisma.user.findUnique({ where: { phone: PHONE } });

  console.log("=== User ===");
  console.log(user);

  if (!user) {
    console.log(`No user row found for phone ${PHONE}`);
    return;
  }

  if (!user.businessId) {
    console.log("\nuser.businessId is null — requireBusinessOwner() would redirect to /onboarding");
    return;
  }

  const business = await prisma.business.findUnique({ where: { id: user.businessId } });

  console.log("\n=== Business ===");
  console.log(
    business
      ? { id: business.id, isSuspended: business.isSuspended, planId: business.planId, slug: business.slug }
      : `No business row found for id ${user.businessId}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
