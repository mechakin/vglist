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
  // make it if no star review, edit it if there is one
  create: privateProcedure
    .input(
      z.object({
        description: z.string().min(1).max(15000),
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
        },
      });

      return review;
    }),

  getReviewsByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.prisma.review
        .findMany({
          where: {
            authorId: input.userId,
          },
          take: 100,
          orderBy: [{ createdAt: "desc" }],
        })
        .then(addUserDataToReviews)
    ),

    getReviewsByGameId: publicProcedure
    .input(z.object({ gameId: z.number() }))
    .query(({ ctx, input }) =>
      ctx.prisma.review
        .findMany({
          where: {
            gameId: input.gameId,
          },
          take: 100,
          orderBy: [{ createdAt: "desc" }],
        })
        .then(addUserDataToReviews)
    ),
  //make a delete reviews
});
