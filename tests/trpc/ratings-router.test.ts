import { expect, it, describe, afterAll, beforeAll } from "vitest";

import { type RouterInputs } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import type {
  SignedOutAuthObject,
  SignedInAuthObject,
} from "@clerk/nextjs/dist/api";

describe("createRatingAndStatus", () => {
  it("creates rating and status successfully", async () => {
    const ctx = createInnerTRPCContext({
      auth: { userId: "fakeId" } as SignedInAuthObject,
    });

    const input: RouterInputs["rating"]["createRatingAndStatus"] = {
      gameId: 2607,
      score: 5,
    };

    const caller = appRouter.createCaller(ctx);

    await expect(caller.rating.createRatingAndStatus(input)).resolves.toEqual(
      expect.objectContaining({ authorId: "fakeId", gameId: 2607, score: 5 })
    );
  });
});

describe("getRatingByAuthorAndGameId", () => {
  it("returns rating for valid authorId and gameId", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });

    const input: RouterInputs["rating"]["getRatingByAuthorAndGameId"] = {
      gameId: 2607,
      authorId: "fakeId",
    };

    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.rating.getRatingByAuthorAndGameId(input)
    ).resolves.toEqual({
      rating: expect.objectContaining({ score: 5 }) as unknown,
    });
  });

  it("returns null for missing authorId or gameId", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });

    const input: RouterInputs["rating"]["getRatingByAuthorAndGameId"] = {};

    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.rating.getRatingByAuthorAndGameId(input)
    ).resolves.toBeNull();
  });
});

describe("getRatingsBySlug", () => {
  it("returns aggregate rating information for valid slug", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });

    const input: RouterInputs["rating"]["getRatingsBySlug"] = {
      slug: "sonic-lost-world",
    };

    const caller = appRouter.createCaller(ctx);

    await expect(caller.rating.getRatingsBySlug(input)).resolves.toEqual(
      expect.objectContaining({
        _avg: { score: 5 },
        _count: { score: 1 },
      })
    );
  });
});

describe("getAverageScoreByUsername", () => {
  it("returns aggregate score information for valid username", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });

    const input: RouterInputs["rating"]["getAverageScoreByUsername"] = {
      username: "test",
    };

    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.rating.getAverageScoreByUsername(input)
    ).resolves.toEqual(
      expect.objectContaining({
        _avg: { score: 5 },
      })
    );
  });
});

describe("getRatingsByUsername", () => {
  beforeAll(async () => {
    const ctx = createInnerTRPCContext({
      auth: { userId: "fakeId" } as SignedInAuthObject,
    });

    const input: RouterInputs["rating"]["createRatingAndStatus"] = {
      gameId: 2608,
      score: 5,
    };

    const caller = appRouter.createCaller(ctx);

    await caller.rating.createRatingAndStatus(input);
  })
  
  it("returns ratings for valid username query", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });

    const input: RouterInputs["rating"]["getRatingsByUsername"] = {
      username: "test",
      limit: 1
    };

    const caller = appRouter.createCaller(ctx);

    await expect(caller.rating.getRatingsByUsername(input)).resolves.toEqual(
      expect.objectContaining({
        ratingCount: 2,
        ratings: [expect.objectContaining({ gameId: 2608, score: 5 })],
      })
    );
  });

  afterAll(async () => {
    const ctx = createInnerTRPCContext({
      auth: { userId: "fakeId" } as SignedInAuthObject,
    });

    const caller = appRouter.createCaller(ctx);

    const status = await caller.status.getStatusByAuthorAndGameId({
      authorId: "fakeId",
      gameId: 2608,
    });

    if (!status?.id) return;

    const input1: RouterInputs["status"]["deleteStatus"] = {
      id: status.id,
    };

    await caller.status.deleteStatus(input1);

    const ratingId = await caller.rating.getRatingByAuthorAndGameId({
      authorId: "fakeId",
      gameId: 2608,
    });

    if (!ratingId?.rating?.id) return;

    const input2: RouterInputs["rating"]["deleteRating"] = {
      id: ratingId?.rating?.id,
    };

    await caller.rating.deleteRating(input2);
  });
});

describe("updateRating", () => {
  it("updates rating successfully", async () => {
    const ctx = createInnerTRPCContext({
      auth: { userId: "fakeId" } as SignedInAuthObject,
    });

    const caller = appRouter.createCaller(ctx);

    const rating = await caller.rating.getRatingByAuthorAndGameId({
      authorId: "fakeId",
      gameId: 2607,
    });

    if (!rating?.rating?.id) return;

    const input: RouterInputs["rating"]["updateRating"] = {
      gameId: 2607,
      score: 10,
      id: rating.rating.id,
    };

    await expect(caller.rating.updateRating(input)).resolves.toEqual(
      expect.objectContaining({ score: 10, authorId: "fakeId" })
    );
  });
});

describe("deleteRating", () => {
  afterAll(async () => {
    const ctx = createInnerTRPCContext({
      auth: { userId: "fakeId" } as SignedInAuthObject,
    });

    const caller = appRouter.createCaller(ctx);

    const status = await caller.status.getStatusByAuthorAndGameId({
      authorId: "fakeId",
      gameId: 2607,
    });

    if (!status?.id) return;

    const input: RouterInputs["status"]["deleteStatus"] = {
      id: status.id,
    };

    await caller.status.deleteStatus(input);
  });

  it("deletes rating successfully", async () => {
    const ctx = createInnerTRPCContext({
      auth: { userId: "fakeId" } as SignedInAuthObject,
    });

    const caller = appRouter.createCaller(ctx);

    const ratingId = await caller.rating.getRatingByAuthorAndGameId({
      authorId: "fakeId",
      gameId: 2607,
    });

    if (!ratingId?.rating?.id) return;

    const input: RouterInputs["rating"]["deleteRating"] = {
      id: ratingId?.rating?.id,
    };

    await expect(caller.rating.deleteRating(input)).resolves.toEqual(
      expect.objectContaining({ score: 10, authorId: "fakeId" })
    );
  });
});
