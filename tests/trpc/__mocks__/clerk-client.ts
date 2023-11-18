import { vi } from "vitest";

interface Props {
  username: string;
  query: string;
  userId: string;
}

vi.mock("@clerk/nextjs/server", () => ({
  clerkClient: {
    users: {
      getUser: vi.fn().mockImplementation((authorId: string) => {
        if (authorId === "fakeId") {
          return Promise.resolve({
            id: "fakeId",
            username: "test",
            profileImageUrl: "https://www.gravatar.com/avatar?d=mp",
          });
        }
        return null;
      }),
      getUserList: vi
        .fn()
        .mockImplementation(({ username, query, userId }: Props) => {
          if (
            (username && username[0] === "test") ||
            (query && query === "test") ||
            (userId && userId[0] === "fakeId")
          ) {
            return Promise.resolve([
              {
                id: "fakeId",
                username: "test",
                profileImageUrl: "https://www.gravatar.com/avatar?d=mp",
              },
            ]);
          }
          return Promise.resolve([]);
        }),
    },
  },
}));
