import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "~/server/api/trpc";

export const ratingRouter = createTRPCRouter({
  getRatingByAuthorAndGameId: publicProcedure
    .input(
      z.object({ authorId: z.string().nullish(), gameId: z.number().nullish() })
    )
    .query(async ({ ctx, input }) => {
      if (input.authorId && input.gameId) {
        const rating = await ctx.prisma.rating.findUnique({
          where: {
            authorId_gameId: {
              authorId: input.authorId,
              gameId: input.gameId,
            },
          },
          include: { game: true },
        });

        return {
          rating,
        };
      }
      return null;
    }),
  getRatingsBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const ratings = await ctx.prisma.rating.aggregate({
        _avg: { score: true },
        _count: { score: true },
        where: { game: { slug: input.slug } },
      });

      return ratings;
    }),
  getAverageScoreByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });

      const authorId = user?.id;

      const ratings = await ctx.prisma.rating.aggregate({
        _avg: { score: true },
        where: { authorId },
      });

      return ratings;
    }),
  getRatingsByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 40;
      const { cursor } = input;

      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });

      const authorId = user?.id;

      const ratings = await ctx.prisma.rating.findMany({
        take: limit + 1,
        where: { authorId },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { id: "desc" },
        include: { game: true },
      });

      const ratingCount = await ctx.prisma.rating.count({
        where: { authorId: { equals: authorId } },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (ratings.length > limit) {
        const nextRating = ratings.pop();
        nextCursor = nextRating?.id;
      }

      return {
        ratings,
        ratingCount,
        nextCursor,
      };
    }),
  createRatingAndStatus: privateProcedure
    .input(
      z.object({
        score: z.number().min(0).max(10),
        gameId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const rating = await ctx.prisma.rating.create({
        data: {
          authorId,
          gameId: input.gameId,
          score: input.score,
        },
      });

      const checkStatus = await ctx.prisma.status.findUnique({
        where: { authorId_gameId: { authorId, gameId: input.gameId } },
      });

      if (!checkStatus) {
        await ctx.prisma.status.create({
          data: {
            authorId,
            isPlaying: true,
            hasBacklogged: false,
            hasDropped: false,
            hasPlayed: false,
            gameId: input.gameId,
          },
        });
      }

      return rating;
    }),
  updateRating: privateProcedure
    .input(
      z.object({
        score: z.number().min(0).max(10),
        gameId: z.number(),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const rating = await ctx.prisma.rating.update({
        where: { id: input.id },

        data: {
          authorId,
          gameId: input.gameId,
          score: input.score,
        },
      });

      return rating;
    }),
  deleteRating: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const rating = await ctx.prisma.rating.delete({
        where: {
          id: input.id,
        },
      });

      return rating;
    }),
});
