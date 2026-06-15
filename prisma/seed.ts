import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.SEED_ADMIN_EMAIL ?? "").trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? "";

  if (!email || !password) {
    console.log(
      "Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to seed an admin user. Skipping."
    );
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN", passwordHash },
    create: { email, role: "ADMIN", passwordHash, name: "Admin" },
  });

  console.log(`Seeded admin user: ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
