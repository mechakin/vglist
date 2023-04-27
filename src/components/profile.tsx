import { api } from "~/utils/api";
import { useUser, UserButton } from "@clerk/nextjs";
import NotFound from "./404";
import Image from "next/image";
import Head from "next/head";

export default function Profile(props: { username: string }) {
  const { data } = api.profile.getUserByUsername.useQuery({
    username: props.username,
  });

  const { user } = useUser();

  if (!data) return <NotFound />;

  return (
    <>
      <Head>
        <title>{props.username}</title>
      </Head>
      <div className="flex items-end pt-4">
        {user?.username !== props.username && (
          <Image
            src={data.profileImageUrl}
            alt={`${props.username}'s profile picture`}
            className="h-24 w-24 rounded-md"
            width={56}
            height={56}
          />
        )}
        {user?.username === props.username && (
          <UserButton
            appearance={{
              elements: {
                // see if you can change on hover classes
                userButtonAvatarBox: {
                  width: 98,
                  height: 98,
                  borderRadius: 6,
                },
                userButtonTrigger: {
                  borderRadius: 6,
                },
              },
            }}
            afterSignOutUrl="/"
          />
        )}
        <h1 className="px-4 text-2xl font-semibold">{props.username}</h1>
      </div>
    </>
  );
}
