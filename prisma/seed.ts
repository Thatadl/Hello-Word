import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin@123", 10);

  const user = await prisma.user.upsert({
    where: { email: "admin@wtec.local" },
    update: {
      passwordHash,
      role: UserRole.ADMIN,
      isActive: true
    },
    create: {
      email: "admin@wtec.local",
      passwordHash,
      role: UserRole.ADMIN,
      employeeProfile: {
        create: {
          fullName: "Admin WTEC",
          jobTitle: "Administrador"
        }
      }
    }
  });

  await prisma.employeeProfile.upsert({
    where: { userId: user.id },
    update: {
      fullName: "Admin WTEC",
      jobTitle: "Administrador",
      isActive: true
    },
    create: {
      userId: user.id,
      fullName: "Admin WTEC",
      jobTitle: "Administrador"
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
