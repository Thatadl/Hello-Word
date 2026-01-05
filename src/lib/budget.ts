import { Prisma, type Budget } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const MAX_RETRIES = 5;

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export async function createBudget(
  data: Omit<Prisma.BudgetCreateInput, "code" | "year" | "seq">,
  client = prisma
): Promise<Budget> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
    try {
      return await client.$transaction(async (tx) => {
        const year = new Date().getFullYear();
        const lastBudget = await tx.budget.findFirst({
          where: { year },
          orderBy: { seq: "desc" },
          select: { seq: true }
        });

        const seq = (lastBudget?.seq ?? 0) + 1;
        const code = `WTEC-ORC-${year}-${seq.toString().padStart(4, "0")}`;

        return tx.budget.create({
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

  throw new Error("Falha ao gerar código único para orçamento.");
}
