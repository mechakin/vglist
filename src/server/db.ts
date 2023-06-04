import { PrismaClient } from "@prisma/client";

import { env } from "~/env.mjs";

type StatusArgs = {
  data: {
    isPlaying: boolean;
    hasPlayed: boolean;
    hasDropped: boolean;
    hasBacklogged: boolean;
  };
  where: {
    id: string;
  };
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

prisma.$use(async (params, next) => {
  if (params.model === "Status" && params.action === "update") {
    const args = params.args as StatusArgs;

    const { isPlaying, hasDropped, hasBacklogged, hasPlayed } = args.data;

    if (
      isPlaying === false &&
      hasPlayed === false &&
      hasDropped === false &&
      hasBacklogged === false
    ) {
      // Delete the status instead of updating it
      await prisma.status.delete({ where: { id: args.where.id } });
      return;
    }
  }

  return next(params);
});
