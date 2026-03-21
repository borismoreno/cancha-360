import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const email = "super_admin@cancha360.com";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("SUPER_ADMIN already exists, skipping seed.");
    return;
  }

  const user = await prisma.user.create({
    data: {
      email,
      name: "Super Admin",
      passwordHash: await bcrypt.hash("admin1234", 10),
      role: Role.SUPER_ADMIN,
    },
  });

  console.log(`SUPER_ADMIN created: ${user.email} (id: ${user.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
