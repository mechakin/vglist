import { TRPCError } from "@trpc/server";
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
      // slows down page time by 1-2s on average, not sure if there's a faster way to do this
      // const gamesCount = await ctx.prisma.game.count({
      //   where: { id: { gt: 0 } },
      // });
      return {
        games,
        gamesCount: 230515,
        nextCursor,
      };
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

      const gameCount = await ctx.prisma.game.count({
        where: { name: { contains: input.name } },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (games.length > limit) {
        const nextGame = games.pop();
        nextCursor = nextGame?.id;
      }
      return {
        games,
        gameCount,
        nextCursor,
      };
    }),
});
