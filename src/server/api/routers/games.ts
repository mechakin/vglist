import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const gameRouter = createTRPCRouter({
  getSomeGames: publicProcedure.query(async ({ ctx }) => {
    const games = await ctx.prisma.game.findMany({
      take: 96,
      orderBy: { igdbRatingCount: "desc" },
    });

    return games;
  }),
  getGameBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const game = await ctx.prisma.game.findUnique({
        where: { slug: input.slug },
      });
      if (!game)
        throw new TRPCError({ code: "NOT_FOUND", message: "Game not found." });
      return game;
    }),
  getGamesByName: publicProcedure
    .input(
      z.object({
        name: z.string(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 16;
      const { cursor } = input;
      const games = await ctx.prisma.game.findMany({
        take: limit + 1,
        where: { name: { contains: input.name } },
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
