import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const gameRouter = createTRPCRouter({
  getAllGames: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 64;
      const { cursor } = input;
      const games = await ctx.prisma.game.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (games.length > limit) {
        const nextGame = games.pop();
        nextCursor = nextGame?.id;
      }
      return {
        games,
        nextCursor,
      };
    }),
});
