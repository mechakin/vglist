import { expect, it, describe } from "vitest";

import { type RouterInputs } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { type SignedOutAuthObject } from "@clerk/nextjs/dist/api";

describe("getGameBySlug", () => {
  it("returns game for valid slug", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });

    const input: RouterInputs["game"]["getGameBySlug"] = {
      slug: "elden-ring",
    };

    const caller = appRouter.createCaller(ctx);

    await expect(caller.game.getGameBySlug(input)).resolves.toEqual(
      expect.objectContaining({
        id: 119133,
        name: "Elden Ring",
        slug: "elden-ring",
      })
    );
  });

  it("throws an error if there is no game", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });

    const input: RouterInputs["game"]["getGameBySlug"] = {
      slug: "notARealGame",
    };
    const caller = appRouter.createCaller(ctx);

    await expect(caller.game.getGameBySlug(input)).rejects.toThrow(TRPCError);
  });
});

describe("getGamesByName", () => {
  it("returns games for valid name query", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });

    const input: RouterInputs["game"]["getGamesByName"] = {
      name: "Mario & Sonic at the Sochi 2014 Olympic Winter Games",
      limit: 1,
    };

    const caller = appRouter.createCaller(ctx);

    await expect(caller.game.getGamesByName(input)).resolves.toEqual({
      games: [
        expect.objectContaining({
          name: "Mario & Sonic at the Sochi 2014 Olympic Winter Games",
          id: 3990,
        }),
      ],
      gameCount: 2,
      nextCursor: 1,
    });
  });

  it("returns an empty array if no games found", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });

    const input: RouterInputs["game"]["getGamesByName"] = {
      name: "notARealGame",
    };

    const caller = appRouter.createCaller(ctx);

    await expect(caller.game.getGamesByName(input)).resolves.toEqual({
      games: [],
      gameCount: 0,
      nextCursor: undefined,
    });
  });
});
