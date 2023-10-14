import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";
import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "~/server/api/trpc";
import type { Game, Review } from "@prisma/client";

const addUserDataToReview = async (
  review: (Review & { game: Game }) | null
) => {
  if (!review) return;

  const user = await clerkClient.users.getUser(review.authorId);
  const author = filterUserForClient(user);

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
};

const addUserDataToReviews = async (reviews: (Review & { game: Game })[]) => {
  const users = (
    await clerkClient.users.getUserList({
      userId: reviews.map((review) => review.authorId),
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
  getReviewsBySlug: publicProcedure
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

      const reviews = await ctx.prisma.review.findMany({
        take: limit + 1,
        include: { game: true },
        where: { game: { slug: input.slug } },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { id: "desc" },
      });

      const reviewCount = await ctx.prisma.review.count({
        where: { game: { slug: input.slug } },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (reviews.length > limit) {
        const nextReview = reviews.pop();
        nextCursor = nextReview?.id;
      }

      const hydratedReviews = await addUserDataToReviews(reviews);

      return {
        reviews: hydratedReviews,
        reviewCount,
        nextCursor,
      };
    }),
  getLatestReviewsByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });

      const authorId = user?.id;

      const reviews = await ctx.prisma.review.findMany({
        take: 3,
        where: { authorId },
        orderBy: { id: "desc" },
        include: {
          game: true,
        },
      });

      const hydratedReviews = await addUserDataToReviews(reviews);

      return { reviews: hydratedReviews };
    }),
  getReviewsByUsername: publicProcedure
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

      const reviews = await ctx.prisma.review.findMany({
        take: limit + 1,
        where: { authorId },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { id: "desc" },
        include: {
          game: true,
        },
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
  getReviewByAuthorAndGameId: publicProcedure
    .input(
      z.object({ authorId: z.string().nullish(), gameId: z.number().nullish() })
    )
    .query(async ({ ctx, input }) => {
      if (input.authorId && input.gameId) {
        const review = await ctx.prisma.review.findUnique({
          where: {
            authorId_gameId: {
              authorId: input.authorId,
              gameId: input.gameId,
            },
          },
          include: { game: true },
        });

        const hydratedReview = await addUserDataToReview(review);

        return {
          review: hydratedReview,
        };
      }
      return null;
    }),
  getReviewCountByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });

      const authorId = user?.id;

      const reviewCount = await ctx.prisma.review.count({
        where: { authorId: { equals: authorId } },
      });

      return reviewCount;
    }),
  getRecentReviews: publicProcedure.query(async ({ ctx }) => {
    const reviews = await ctx.prisma.review.findMany({
      take: 8,
      include: {
        game: true,
      },
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
  updateReview: privateProcedure
    .input(
      z.object({
        score: z.number().min(0).max(10).optional(),
        description: z.string().min(1).max(10000),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.prisma.review.update({
        where: {
          id: input.id,
        },
        data: {
          score: input.score,
          description: input.description,
        },
      });

      return review;
    }),
  deleteReview: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.review.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
