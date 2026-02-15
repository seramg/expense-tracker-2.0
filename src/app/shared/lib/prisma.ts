// src/app/shared/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is not defined at runtime");
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
