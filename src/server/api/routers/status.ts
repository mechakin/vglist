import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { ratelimit } from "~/server/helpers/rateLimiter";

export const statusRouter = createTRPCRouter({
  getPlayedStatusByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });

      const authorId = user?.id;

      const status = await ctx.prisma.status.findMany({
        where: { authorId, hasPlayed: true },
      });

      return status;
    }),
  getPlayingStatusByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });

      const authorId = user?.id;

      const status = await ctx.prisma.status.findMany({
        where: { authorId, isPlaying: true },
      });

      return status;
    }),
  getBackloggedStatusByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });

      const authorId = user?.id;

      const status = await ctx.prisma.status.findMany({
        where: { authorId, hasBacklogged: true },
      });

      return status;
    }),
  getDroppedStatusByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });

      const authorId = user?.id;

      const status = await ctx.prisma.status.findMany({
        where: { authorId, hasDropped: true },
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

      const { success } = await ratelimit.limit(authorId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

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
});
