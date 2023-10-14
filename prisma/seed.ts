import { prisma } from "../src/server/db";
import igdb from "igdb-api-node";
import algoliasearch from "algoliasearch";
import { env } from "~/env.mjs";
import fetch from "node-fetch";

type AccessTokenData = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

type Game = {
  id: number;
  updated_at: number;
  cover?: {
    id: number;
    url: string;
  };
  name: string;
  first_release_date?: number;
  summary?: string;
  rating?: number;
  rating_count?: number;
  slug: string;
};

type PrismaGame = {
  id: number;
  igdbUpdatedAt: number;
  cover?: string;
  name: string;
  releaseDate?: number;
  summary?: string;
  igdbRating?: number;
  igdbRatingCount?: number;
  slug: string;
};

async function main() {
  const response = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${env.TWITCH_CLIENT_ID}&client_secret=${env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
    { method: "POST" }
  );

  const { access_token } = (await response.json()) as AccessTokenData;

  const apiClient = igdb(env.TWITCH_CLIENT_ID, access_token);
  const searchClient = algoliasearch(
    env.ALGOLIA_APP_ID,
    env.ALGOLIA_ADMIN_API_KEY
  );

  const index = searchClient.initIndex("game");

  const maxIGDBResponses = 600;
  for (let i = 1; i < maxIGDBResponses; i++) {
    const response = await apiClient
      .fields(
        "name,summary,slug,rating,rating_count,first_release_date,cover.url,updated_at"
      )
      .limit(500)
      .offset(500 * i)
      .sort("id", "asc")
      .request("/games");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const data: PrismaGame[] = response.data.map((game: Game) => {
      const coverUrl = game.cover?.url;

      if (coverUrl) {
        const formattedCoverUrl =
          "https:" + coverUrl.replace("t_thumb", "t_cover_big");
        return {
          id: game.id,
          igdbUpdatedAt: game.updated_at,
          cover: formattedCoverUrl,
          name: game.name,
          releaseDate: game.first_release_date,
          summary: game.summary,
          igdbRating: game.rating ?? 0,
          igdbRatingCount: game.rating_count ?? 0,
          slug: game.slug,
        };
      }
      return {
        id: game.id,
        igdbUpdatedAt: game.updated_at,
        cover: game.cover?.url,
        name: game.name,
        releaseDate: game.first_release_date,
        summary: game.summary,
        igdbRating: game.rating ?? 0,
        igdbRatingCount: game.rating_count ?? 0,
        slug: game.slug,
      };
    });

    await prisma.game.createMany({
      data,
    });

    const algoliaData = data.map((game) => {
      return {
        ...game,
        objectID: `${game.id}`,
      };
    });    

    const search = await index.saveObjects(algoliaData, {});

    console.log(search)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
