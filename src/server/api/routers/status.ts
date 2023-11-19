import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const statusRouter = createTRPCRouter({
  getStatusByAuthorAndGameId: publicProcedure
    .input(
      z.object({ authorId: z.string().nullish(), gameId: z.number().nullish() })
    )
    .query(async ({ ctx, input }) => {
      if (input.authorId && input.gameId) {
        const status = await ctx.prisma.status.findUnique({
          where: {
            authorId_gameId: {
              authorId: input.authorId,
              gameId: input.gameId,
            },
          },
          include: { game: true },
        });

        return status;
      }
      return null;
    }),
  getStatusByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        allStatus: z.boolean().nullish(),
        isPlaying: z.boolean().nullish(),
        hasPlayed: z.boolean().nullish(),
        hasBacklogged: z.boolean().nullish(),
        hasDropped: z.boolean().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 40;
      const {
        cursor,
        allStatus,
        isPlaying,
        hasBacklogged,
        hasDropped,
        hasPlayed,
      } = input;

      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });

      const authorId = user?.id;

      const status = await ctx.prisma.status.findMany({
        where: {
          authorId,
          ...(allStatus
            ? {
                OR: [
                  { hasPlayed: true },
                  { hasDropped: true },
                  { isPlaying: true },
                  { hasBacklogged: true },
                ],
              }
            : {
                isPlaying: isPlaying ?? false,
                hasPlayed: hasPlayed ?? false,
                hasBacklogged: hasBacklogged ?? false,
                hasDropped: hasDropped ?? false,
              }),
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { id: "desc" },
        include: { game: { include: { ratings: { where: { authorId } } } } },
      });

      const statusCount = await ctx.prisma.status.count({
        where: {
          authorId,
          ...(allStatus
            ? {
                OR: [
                  { hasPlayed: true },
                  { hasDropped: true },
                  { isPlaying: true },
                  { hasBacklogged: true },
                ],
              }
            : {
                isPlaying: isPlaying ?? false,
                hasPlayed: hasPlayed ?? false,
                hasBacklogged: hasBacklogged ?? false,
                hasDropped: hasDropped ?? false,
              }),
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (status.length > limit) {
        const nextStatus = status.pop();
        nextCursor = nextStatus?.id;
      }

      return { status, statusCount, nextCursor };
    }),
  getGamesPlayedCountByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });

      const authorId = user?.id;

      const count = await ctx.prisma.status.count({
        where: {
          authorId,
          OR: [{ hasPlayed: true }, { hasDropped: true }, { isPlaying: true }],
        },
      });

      return count;
    }),
  getRecentlyPlayedByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });

      const authorId = user?.id;

      const statusWithGame = await ctx.prisma.status.findMany({
        where: {
          authorId,
          OR: [{ hasPlayed: true }, { hasDropped: true }, { isPlaying: true }],
        },
        include: { game: true },
        take: 6,
        orderBy: { id: "desc" },
      });

      return statusWithGame;
    }),
  createStatus: privateProcedure
    .input(
      z.object({
        hasBacklogged: z.boolean(),
        hasPlayed: z.boolean(),
        hasDropped: z.boolean(),
        isPlaying: z.boolean(),
        gameId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const status = await ctx.prisma.status.create({
        data: {
          authorId,
          gameId: input.gameId,
          hasBacklogged: input.hasBacklogged,
          hasPlayed: input.hasPlayed,
          hasDropped: input.hasDropped,
          isPlaying: input.isPlaying,
        },
      });

      return status;
    }),
  updateStatus: privateProcedure
    .input(
      z.object({
        hasBacklogged: z.boolean(),
        hasPlayed: z.boolean(),
        hasDropped: z.boolean(),
        isPlaying: z.boolean(),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const status = await ctx.prisma.status.update({
        where: { id: input.id },

        data: {
          authorId,
          hasBacklogged: input.hasBacklogged,
          hasPlayed: input.hasPlayed,
          hasDropped: input.hasDropped,
          isPlaying: input.isPlaying,
        },
      });

      return status;
    }),
  deleteStatus: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const status = await ctx.prisma.status.delete({
        where: { id: input.id },
      });

      return status;
    }),
});
