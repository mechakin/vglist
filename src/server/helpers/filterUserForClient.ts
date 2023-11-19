import type { User } from "@clerk/nextjs/dist/api";

export function filterUserForClient(user: User) {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
  };
}

export function filterUsersForClient(users: User[]) {
  const filteredUsers = users.map((user) => {
    return {
      id: user.id,
      username: user.username,
      profileImageUrl: user.profileImageUrl,
    };
  });
  return filteredUsers;
}
