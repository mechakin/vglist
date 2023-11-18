import { expect, it, describe, beforeAll, afterAll } from "vitest";

import { type RouterInputs } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import type {
  SignedInAuthObject,
  SignedOutAuthObject,
} from "@clerk/nextjs/dist/api";

describe("createStatus", () => {
  it("creates status successfully", async () => {
    const ctx = createInnerTRPCContext({
      auth: { userId: "fakeId" } as SignedInAuthObject,
    });

    const input: RouterInputs["status"]["createStatus"] = {
      gameId: 2607,
      isPlaying: true,
      hasPlayed: false,
      hasDropped: false,
      hasBacklogged: false,
    };

    const caller = appRouter.createCaller(ctx);

    await expect(caller.status.createStatus(input)).resolves.toEqual(
      expect.objectContaining({
        authorId: "fakeId",
        gameId: 2607,
        isPlaying: true,
        hasPlayed: false,
        hasDropped: false,
        hasBacklogged: false,
      })
    );
  });
});

describe("getStatusByAuthorAndGameId", () => {
  it("returns status for valid authorId and gameId", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });

    const input: RouterInputs["status"]["getStatusByAuthorAndGameId"] = {
      authorId: "fakeId",
      gameId: 2607,
    };

    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.status.getStatusByAuthorAndGameId(input)
    ).resolves.toEqual(
      expect.objectContaining({
        authorId: "fakeId",
        gameId: 2607,
        isPlaying: true,
        hasPlayed: false,
        hasDropped: false,
        hasBacklogged: false,
      })
    );
  });

  it("returns null for missing authorId or gameId", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });

    const input: RouterInputs["status"]["getStatusByAuthorAndGameId"] = {};

    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.status.getStatusByAuthorAndGameId(input)
    ).resolves.toBeNull();
  });
});

describe("updateStatus", () => {
  it("updates status successfully", async () => {
    const ctx = createInnerTRPCContext({
      auth: { userId: "fakeId" } as SignedInAuthObject,
    });

    const caller = appRouter.createCaller(ctx);

    const status = await caller.status.getStatusByAuthorAndGameId({
      authorId: "fakeId",
      gameId: 2607,
    });

    if (!status?.id) return;

    const input: RouterInputs["status"]["updateStatus"] = {
      id: status.id,
      isPlaying: false,
      hasPlayed: true,
      hasDropped: false,
      hasBacklogged: false,
    };

    await expect(caller.status.updateStatus(input)).resolves.toEqual(
      expect.objectContaining({
        authorId: "fakeId",
        gameId: 2607,
        isPlaying: false,
        hasPlayed: true,
        hasDropped: false,
        hasBacklogged: false,
      })
    );
  });

  it("deletes status and return undefined if all of the statuses when updating are false", async () => {
    const ctx = createInnerTRPCContext({
      auth: { userId: "fakeId" } as SignedInAuthObject,
    });

    const caller = appRouter.createCaller(ctx);

    const status = await caller.status.getStatusByAuthorAndGameId({
      authorId: "fakeId",
      gameId: 2607,
    });

    if (!status?.id) return;

    const input: RouterInputs["status"]["updateStatus"] = {
      id: status.id,
      isPlaying: false,
      hasPlayed: false,
      hasDropped: false,
      hasBacklogged: false,
    };

    await expect(caller.status.updateStatus(input)).resolves.toBeUndefined();
  });
});

describe("getStatusByUsername", () => {
  beforeAll(async () => {
    const ctx = createInnerTRPCContext({
      auth: { userId: "fakeId" } as SignedInAuthObject,
    });

    const input1: RouterInputs["status"]["createStatus"] = {
      gameId: 2607,
      isPlaying: false,
      hasPlayed: true,
      hasDropped: false,
      hasBacklogged: false,
    };

    const input2: RouterInputs["status"]["createStatus"] = {
      gameId: 2608,
      isPlaying: false,
      hasPlayed: true,
      hasDropped: false,
      hasBacklogged: false,
    };

    const caller = appRouter.createCaller(ctx);

    await caller.status.createStatus(input1);
    await caller.status.createStatus(input2);
  });

  it("returns status for specific value with a valid username query", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });

    const input: RouterInputs["status"]["getStatusByUsername"] = {
      username: "test",
      hasPlayed: true,
    };

    const caller = appRouter.createCaller(ctx);

    await expect(caller.status.getStatusByUsername(input)).resolves.toEqual(
      expect.objectContaining({
        status: [
          expect.objectContaining({
            authorId: "fakeId",
            gameId: 2608,
            isPlaying: false,
            hasPlayed: true,
            hasDropped: false,
            hasBacklogged: false,
          }),
          expect.objectContaining({
            authorId: "fakeId",
            gameId: 2607,
            isPlaying: false,
            hasPlayed: true,
            hasDropped: false,
            hasBacklogged: false,
          }),
        ],
        statusCount: 2,
      })
    );
  });

  it("returns status for all values with a valid username query", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });

    const input: RouterInputs["status"]["getStatusByUsername"] = {
      username: "test",
      allStatus: true,
      limit: 1,
    };

    const caller = appRouter.createCaller(ctx);

    const statuses = await caller.status.getStatusByUsername(input);

    expect(statuses).toEqual(
      expect.objectContaining({
        status: [
          expect.objectContaining({
            authorId: "fakeId",
            gameId: 2608,
            isPlaying: false,
            hasPlayed: true,
            hasDropped: false,
            hasBacklogged: false,     
          }),
        ],
        statusCount: 2,
        nextCursor: expect.any(String) as string,
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

    const input: RouterInputs["status"]["deleteStatus"] = {
      id: status.id,
    };

    await caller.status.deleteStatus(input);
  });
});

describe("getGamesPlayedCountByUsername", () => {
  it("returns games played count for valid username", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });

    const input: RouterInputs["status"]["getGamesPlayedCountByUsername"] = {
      username: "test",
    };

    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.status.getGamesPlayedCountByUsername(input)
    ).resolves.toEqual(1);
  });
});

describe("getRecentlyPlayedByUsername", () => {
  it("returns recently played games for valid username", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });

    const input: RouterInputs["status"]["getRecentlyPlayedByUsername"] = {
      username: "test",
    };

    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.status.getRecentlyPlayedByUsername(input)
    ).resolves.toEqual([
      expect.objectContaining({
        authorId: "fakeId",
        gameId: 2607,
        isPlaying: false,
        hasPlayed: true,
        hasDropped: false,
        hasBacklogged: false,
      }),
    ]);
  });
});

describe("deleteStatus", () => {
  it("deletes status successfully", async () => {
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

    await expect(caller.status.deleteStatus(input)).resolves.toEqual(
      expect.objectContaining({
        authorId: "fakeId",
        gameId: 2607,
        isPlaying: false,
        hasPlayed: true,
        hasDropped: false,
        hasBacklogged: false,
      })
    );
  });
});
