import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";
import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "~/server/api/trpc";
import type { Game, Rating } from "@prisma/client";
import { ratelimit } from "~/server/helpers/rateLimiter";

const addUserDataToRatings = async (ratings: (Rating & { game: Game })[]) => {
  const users = (
    await clerkClient.users.getUserList({
      userId: ratings.map((rating) => rating.authorId),
    })
  ).map(filterUserForClient);

  return ratings.map((rating) => {
    const author = users.find((user) => user.id === rating.authorId);

    if (!author || !author.username) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Author for post not found",
      });
    }

    return {
      rating,
      author: {
        ...author,
        username: author.username,
      },
    };
  });
};

export const ratingRouter = createTRPCRouter({
  getRatingsBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 12;
      const { cursor } = input;

      const ratings = await ctx.prisma.rating.findMany({
        take: limit + 1,
        include: { game: true },
        where: { game: { slug: input.slug } },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { id: "desc" },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (ratings.length > limit) {
        const nextRating = ratings.pop();
        nextCursor = nextRating?.id;
      }

      const hydratedRatings = await addUserDataToRatings(ratings);

      return {
        ratings: hydratedRatings,
        nextCursor,
      };
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
      const limit = input.limit ?? 12;
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
        include: {
          game: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (ratings.length > limit) {
        const nextRating = ratings.pop();
        nextCursor = nextRating?.id;
      }

      const hydratedRatings = await addUserDataToRatings(ratings);

      return {
        ratings: hydratedRatings,
        nextCursor,
      };
    }),
  getRatingCountByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });

      const authorId = user?.id;

      const ratingCount = await ctx.prisma.rating.count({
        where: { authorId: { equals: authorId } },
      });

      return ratingCount;
    }),
  createRating: privateProcedure
    .input(z.object({ score: z.number().min(0).max(10), gameId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const { success } = await ratelimit.limit(authorId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const rating = await ctx.prisma.rating.create({
        data: {
          authorId,
          gameId: input.gameId,
          isPlaying: true,
        },
      });

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

      const { success } = await ratelimit.limit(authorId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const rating = await ctx.prisma.rating.update({
        where: { id: input.id },

        data: {
          authorId,
          gameId: input.gameId,
          isPlaying: true,
        },
      });

      return rating;
    }),
  deleteRating: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const { success } = await ratelimit.limit(authorId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      await ctx.prisma.rating.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
