import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";
import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "~/server/api/trpc";
import type { Review } from "@prisma/client";
import { ratelimit } from "~/server/helpers/rateLimiter";

const addUserDataToReviews = async (reviews: Review[]) => {
  const users = (
    await clerkClient.users.getUserList({
      userId: reviews.map((post) => post.authorId),
      limit: 100,
    })
  ).map(filterUserForClient);

  return reviews.map((review) => {
    const author = users.find((user) => user.id === review.authorId);

    if (!author || !author.username) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Author for post not found",
      });
    }

    return {
      review,
      author: {
        ...author,
        username: author.username,
      },
    };
  });
};

export const reviewRouter = createTRPCRouter({
  getReviewsByGameId: publicProcedure
    .input(
      z.object({
        gameId: z.number(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 12;
      const { cursor } = input;
      const reviews = await ctx.prisma.review.findMany({
        take: limit + 1,
        where: { gameId: input.gameId },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { id: "desc" },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (reviews.length > limit) {
        const nextReview = reviews.pop();
        nextCursor = nextReview?.id;
      }
      const hydratedReviews = await addUserDataToReviews(reviews);
      return {
        reviews: hydratedReviews,
        nextCursor,
      };
    }),
  getReviewsByAuthorId: publicProcedure
    .input(
      z.object({
        authorId: z.string(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 12;
      const { cursor } = input;
      const reviews = await ctx.prisma.review.findMany({
        take: limit + 1,
        where: { authorId: input.authorId },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { id: "desc" },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (reviews.length > limit) {
        const nextReview = reviews.pop();
        nextCursor = nextReview?.id;
      }
      const hydratedReviews = await addUserDataToReviews(reviews);
      return {
        reviews: hydratedReviews,
        nextCursor,
      };
    }),
  getRecentReviews: publicProcedure.query(async ({ ctx }) => {
    const reviews = await ctx.prisma.review.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
    });
    const hydratedReviews = await addUserDataToReviews(reviews);
    return {
      reviews: hydratedReviews,
    };
  }),
  createReview: privateProcedure
    .input(
      z.object({
        score: z.number().min(0).max(10).optional(),
        description: z.string().min(1).max(10000),
        gameId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const { success } = await ratelimit.limit(authorId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const review = await ctx.prisma.review.create({
        data: {
          authorId,
          description: input.description,
          score: input.score,
          gameId: input.gameId,
        },
      });

      return review;
    }),
});
