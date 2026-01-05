import { Prisma, type ServiceOrder } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const MAX_RETRIES = 5;

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export async function createServiceOrder(
  data: Omit<Prisma.ServiceOrderCreateInput, "code" | "year" | "seq">,
  client = prisma
): Promise<ServiceOrder> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
    try {
      return await client.$transaction(async (tx) => {
        const year = new Date().getFullYear();
        const lastOrder = await tx.serviceOrder.findFirst({
          where: { year },
          orderBy: { seq: "desc" },
          select: { seq: true }
        });

        const seq = (lastOrder?.seq ?? 0) + 1;
        const code = `WTEC-OS-${year}-${seq.toString().padStart(4, "0")}`;

        return tx.serviceOrder.create({
          data: {
            ...data,
            year,
            seq,
            code
          }
        });
      });
    } catch (error) {
      if (isUniqueConstraintError(error) && attempt < MAX_RETRIES - 1) {
        continue;
      }
      throw error;
    }
  }

  throw new Error("Falha ao gerar código único para OS.");
}
