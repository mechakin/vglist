import { expect, it, describe } from "vitest";

import { type RouterInputs } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import type {
  SignedOutAuthObject,
  SignedInAuthObject,
} from "@clerk/nextjs/dist/api";

interface ExpectedAuthor {
  id: string;
}

interface ExpectedReview {
  description: string;
}

interface ExpectedCompleteReview {
  id: string;
  description: string;
}

describe("createReview", () => {
  it("creates review successfully", async () => {
    const ctx = createInnerTRPCContext({
      auth: { userId: "fakeId" } as SignedInAuthObject,
    });

    const input: RouterInputs["review"]["createReview"] = {
      gameId: 2607,
      description: "this is a test game review",
      score: 5,
    };

    const caller = appRouter.createCaller(ctx);

    await expect(caller.review.createReview(input)).resolves.toEqual(
      expect.objectContaining({
        authorId: "fakeId",
        description: "this is a test game review",
        score: 5,
      })
    );
  });
});

describe("getReviewsBySlug", () => {
  it("returns reviews for valid slug query", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });
    const input: RouterInputs["review"]["getReviewsBySlug"] = {
      slug: "sonic-lost-world",
    };
    const caller = appRouter.createCaller(ctx);
    await expect(caller.review.getReviewsBySlug(input)).resolves.toEqual(
      expect.objectContaining({
        reviews: [
          expect.objectContaining({
            author: expect.objectContaining({ id: "fakeId" }) as ExpectedAuthor,
            review: expect.objectContaining({
              description: "this is a test game review",
            }) as ExpectedReview,
          }),
        ],
      })
    );
  });
});

describe("getLatestReviewsByUsername", () => {
  it("returns latest reviews for valid username", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });

    const input: RouterInputs["review"]["getLatestReviewsByUsername"] = {
      username: "test",
    };

    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.review.getLatestReviewsByUsername(input)
    ).resolves.toEqual(
      expect.objectContaining({
        reviews: [
          expect.objectContaining({
            author: expect.objectContaining({ id: "fakeId" }) as ExpectedAuthor,
            review: expect.objectContaining({
              description: "this is a test game review",
            }) as ExpectedReview,
          }),
        ],
      })
    );
  });
});

describe("getReviewsByUsername", () => {
  it("returns reviews for valid username query", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });
    const input: RouterInputs["review"]["getReviewsByUsername"] = {
      username: "test",
    };
    const caller = appRouter.createCaller(ctx);
    await expect(caller.review.getReviewsByUsername(input)).resolves.toEqual(
      expect.objectContaining({
        reviews: [
          expect.objectContaining({
            author: expect.objectContaining({ id: "fakeId" }) as ExpectedAuthor,
            review: expect.objectContaining({
              description: "this is a test game review",
            }) as ExpectedReview,
          }),
        ],
      })
    );
  });
});

describe("getReviewByAuthorAndGameId", () => {
  it("returns review for valid authorId and gameId", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });

    const input: RouterInputs["review"]["getReviewByAuthorAndGameId"] = {
      authorId: "fakeId",
      gameId: 2607,
    };

    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.review.getReviewByAuthorAndGameId(input)
    ).resolves.toEqual(
      expect.objectContaining({
        review: expect.objectContaining({
          author: expect.objectContaining({ id: "fakeId" }) as ExpectedAuthor,
          review: expect.objectContaining({
            description: "this is a test game review",
          }) as ExpectedReview,
        }) as ExpectedCompleteReview,
      })
    );
  });

  it("returns null for missing authorId or gameId", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });

    const input: RouterInputs["review"]["getReviewByAuthorAndGameId"] = {};

    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.review.getReviewByAuthorAndGameId(input)
    ).resolves.toBeNull();
  });
});

describe("getReviewCountByUsername", () => {
  it("returns review count for valid username", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });

    const input: RouterInputs["review"]["getReviewCountByUsername"] = {
      username: "test",
    };

    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.review.getReviewCountByUsername(input)
    ).resolves.toEqual(1);
  });
});

describe("updateReview", () => {
  it("updates review successfully", async () => {
    const ctx = createInnerTRPCContext({
      auth: { userId: "fakeId" } as SignedInAuthObject,
    });

    const caller = appRouter.createCaller(ctx);

    const review = await caller.review.getReviewByAuthorAndGameId({
      authorId: "fakeId",
      gameId: 2607,
    });

    if (!review?.review?.review.id) return;

    const input: RouterInputs["review"]["updateReview"] = {
      id: review?.review?.review.id,
      description: "this is an edited test game review",
    };

    await expect(caller.review.updateReview(input)).resolves.toEqual(
      expect.objectContaining({
        authorId: "fakeId",
        gameId: 2607,
        id: review.review.review.id,
      })
    );
  });
});

describe("getRecentReviews", () => {
  it("returns recent reviews", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });
    const caller = appRouter.createCaller(ctx);

    await expect(caller.review.getRecentReviews()).resolves.toEqual(
      expect.objectContaining({
        reviews: [
          expect.objectContaining({
            author: expect.objectContaining({ id: "fakeId" }) as ExpectedAuthor,
            review: expect.objectContaining({
              description: "this is an edited test game review",
            }) as ExpectedReview,
          }),
        ],
      })
    );
  });
});

describe("deleteReview", () => {
  it("deletes review successfully", async () => {
    const ctx = createInnerTRPCContext({
      auth: { userId: "fakeId" } as SignedInAuthObject,
    });

    const caller = appRouter.createCaller(ctx);

    const review = await caller.review.getReviewByAuthorAndGameId({
      authorId: "fakeId",
      gameId: 2607,
    });

    if (!review?.review?.review.id) return;

    const input: RouterInputs["review"]["deleteReview"] = {
      id: review.review.review.id,
    };

    await expect(caller.review.deleteReview(input)).resolves.toEqual(
      expect.objectContaining({
        authorId: "fakeId",
        gameId: 2607,
        id: review.review.review.id,
      })
    );
  });
});
