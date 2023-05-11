import { api } from "~/utils/api";
import NotFound from "./404";
import Image from "next/image";
import Head from "next/head";

export default function Profile(props: { username: string }) {
  const { data } = api.profile.getUserByUsername.useQuery({
    username: props.username,
  });

  if (!data) return <NotFound />;

  return (
    <>
      <Head>
        <title>{props.username}</title>
        <meta
          name="description"
          content={`${props.username}'s vglist profile`}
        />
        <meta
          name="og:description"
          content={`${props.username}'s vglist profile`}
        />
        <meta
          property="twitter:description"
          content={`${props.username}'s vglist profile`}
        />
        <meta property="og:title" content={props.username} />
        <meta property="twitter:title" content={props.username} />
        <meta
          property="og:url"
          content={`https://vglist.org/users/${props.username}`}
        />
        {/* <meta
          property="og:image"
          content={`https://vglist.org/api/og?username=${data.profileImageUrl}`}
        /> */}
      </Head>
      <div className="flex items-end pt-4">
        <Image
          src={data.profileImageUrl}
          alt={`${props.username}'s profile picture`}
          className="h-24 w-24 rounded-md"
          width={56}
          height={56}
          priority
        />

        <h1 className="px-4 text-2xl font-semibold">{props.username}</h1>
      </div>
    </>
  );
}
