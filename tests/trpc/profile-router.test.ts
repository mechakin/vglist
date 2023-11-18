import { expect, it, describe } from "vitest";

import { type RouterInputs } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import type {
  SignedInAuthObject,
  SignedOutAuthObject,
} from "@clerk/nextjs/dist/api";

describe("getUserByUserName", () => {
  it("returns user for valid username", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });

    const input: RouterInputs["profile"]["getUserByUsername"] = {
      username: "test",
    };

    const caller = appRouter.createCaller(ctx);

    await expect(caller.profile.getUserByUsername(input)).resolves.toEqual({
      username: "test",
      id: "fakeId",
      profileImageUrl: "https://www.gravatar.com/avatar?d=mp",
    });
  });

  it("throws an error if there is no user", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });

    const input: RouterInputs["profile"]["getUserByUsername"] = {
      username: "notARealUser",
    };

    const caller = appRouter.createCaller(ctx);

    await expect(caller.profile.getUserByUsername(input)).rejects.toThrow(
      TRPCError
    );
  });
});

describe("getUsersByUserName", () => {
  it("returns users for valid username query", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });

    const input: RouterInputs["profile"]["getUsersByQuery"] = {
      query: "test",
    };

    const caller = appRouter.createCaller(ctx);

    await expect(caller.profile.getUsersByQuery(input)).resolves.toEqual([
      expect.objectContaining({
        username: "test",
        id: "fakeId",
        profileImageUrl: "https://www.gravatar.com/avatar?d=mp",
      }),
    ]);
  });

  it("returns an empty array if no users found", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });

    const input: RouterInputs["profile"]["getUsersByQuery"] = {
      query: "notARealUser",
    };

    const caller = appRouter.createCaller(ctx);

    await expect(caller.profile.getUsersByQuery(input)).resolves.toEqual([]);
  });
});

describe("createBio", () => {
  it("creates bio successfully when authenticated", async () => {
    const ctx = createInnerTRPCContext({
      auth: { userId: "fakeId" } as SignedInAuthObject,
    });

    const input: RouterInputs["profile"]["createBio"] = {
      bio: "test bio",
    };

    const caller = appRouter.createCaller(ctx);

    await expect(caller.profile.createBio(input)).resolves.toEqual(
      expect.objectContaining({ authorId: "fakeId", bio: "test bio" })
    );
  });

  it("throws error for createBio when not authenticated", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });

    const input: RouterInputs["profile"]["createBio"] = {
      bio: "test bio",
    };

    const caller = appRouter.createCaller(ctx);

    await expect(caller.profile.createBio(input)).rejects.toThrow(TRPCError);
  });
});

describe("updateBio", () => {
  it("updates bio successfully when authenticated", async () => {
    const ctx = createInnerTRPCContext({
      auth: { userId: "fakeId" } as SignedInAuthObject,
    });

    const input: RouterInputs["profile"]["updateBio"] = {
      bio: "updated test bio",
    };

    const caller = appRouter.createCaller(ctx);

    await expect(caller.profile.updateBio(input)).resolves.toEqual(
      expect.objectContaining({ authorId: "fakeId", bio: "updated test bio" })
    );
  });

  it("throws error for updateBio when not authenticated", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });

    const input: RouterInputs["profile"]["updateBio"] = {
      bio: "test bio",
    };

    const caller = appRouter.createCaller(ctx);

    await expect(caller.profile.updateBio(input)).rejects.toThrow(TRPCError);
  });
});

describe("getBioByUserName", () => {
  it("returns bio for valid username", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });

    const input: RouterInputs["profile"]["getBioByUsername"] = {
      username: "test",
    };

    const caller = appRouter.createCaller(ctx);

    await expect(caller.profile.getBioByUsername(input)).resolves.toEqual(
      expect.objectContaining({ authorId: "fakeId", bio: "updated test bio" })
    );
  });

  it("throws error for invalid username for getting bio", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });

    const input: RouterInputs["profile"]["getBioByUsername"] = {
      username: "notARealUser",
    };

    const caller = appRouter.createCaller(ctx);

    await expect(caller.profile.getBioByUsername(input)).rejects.toThrow(
      TRPCError
    );
  });
});

describe("deleteBio", () => {
  it("throws error for deleteBio when not authenticated", async () => {
    const ctx = createInnerTRPCContext({ auth: {} as SignedOutAuthObject });

    const caller = appRouter.createCaller(ctx);

    await expect(caller.profile.deleteBio()).rejects.toThrow(TRPCError);
  });

  it("deletes bio successfully when authenticated", async () => {
    const ctx = createInnerTRPCContext({
      auth: { userId: "fakeId" } as SignedInAuthObject,
    });

    const caller = appRouter.createCaller(ctx);

    await expect(caller.profile.deleteBio()).resolves.toEqual(
      expect.objectContaining({ authorId: "fakeId", bio: "updated test bio" })
    );
  });
});
