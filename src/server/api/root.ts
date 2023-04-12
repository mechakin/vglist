import { createTRPCRouter } from "~/server/api/trpc";
import { profileRouter } from "./routers/profile";
import { reviewsRouter } from "./routers/reviews";
import { ratingsRouter } from "./routers/ratings";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  profile: profileRouter,
  reviews: reviewsRouter,
  ratings: ratingsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
