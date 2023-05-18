import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  filterUserForClient,
  filterUsersForClient,
} from "~/server/helpers/filterUserForClient";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { ratelimit } from "~/server/helpers/rateLimiter";

export const statusRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found.",
        });
      }

      return filterUserForClient(user);
    }),
  getUsersByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const users = await clerkClient.users.getUserList({
        query: input.username,
      });

      if (!users) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Users not found.",
        });
      }
      return filterUsersForClient(users);
    }),
  getBioByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });

      const authorId = user?.id;

      const bio = await ctx.prisma.profile.findUnique({
        where: { authorId },
      });

      return bio;
    }),
  createBio: privateProcedure
    .input(z.object({ bio: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const { success } = await ratelimit.limit(authorId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const bio = await ctx.prisma.profile.create({
        data: {
          authorId,
          bio: input.bio,
        },
      });

      return bio;
    }),
  updateBio: privateProcedure
    .input(z.object({ bio: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const { success } = await ratelimit.limit(authorId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const bio = await ctx.prisma.profile.update({
        where: { authorId },

        data: {
          authorId,
          bio: input.bio,
        },
      });

      return bio;
    }),
});
