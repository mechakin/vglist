import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import algoliasearch from "algoliasearch/lite";
import { env } from "~/env.mjs";
import type { Game } from "@prisma/client";

const searchClient = algoliasearch(
  env.ALGOLIA_APP_ID,
  env.ALGOLIA_ADMIN_API_KEY
);

const index = searchClient.initIndex("game");

export const gameRouter = createTRPCRouter({
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
        limit: z.number().min(1).max(100).default(20),
        cursor: z.number().nullish(),
      })
    )
    .query(async ({ input }) => {
      const { cursor, limit } = input;

      const searchResults = await index.search(input.name, {
        page: cursor ?? 0,
        hitsPerPage: limit,
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (searchResults.nbHits > limit) {
        nextCursor = cursor ?? 0 + 1;
      }
      return {
        games: searchResults.hits as unknown as Game,
        gameCount: searchResults.nbHits,
        nextCursor,
      };
    }),
});
