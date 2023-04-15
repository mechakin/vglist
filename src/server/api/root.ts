import { createTRPCRouter } from "~/server/api/trpc";
import { profileRouter } from "./routers/profile";
import { reviewRouter } from "./routers/reviews";
import { gameRouter } from "./routers/games";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  profile: profileRouter,
  review: reviewRouter,
  game: gameRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
