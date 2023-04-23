/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { prisma } from "../src/server/db";
import igdb from "igdb-api-node";

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

async function main() {
  const client = igdb(
    process.env.TWITCH_CLIENT_ID,
    process.env.TWITCH_APP_ACCESS_TOKEN
  );
  const maxIGDBResponses = 500;
  for (let i = 0; i < maxIGDBResponses; i++) {
    const response = await client
      .fields(
        "name,summary,slug,rating,rating_count,first_release_date,cover.url,updated_at"
      )
      .limit(2)
      .offset(500 * i + 402)
      .sort("id", "asc")
      .request("/games");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const data = response.data.map((game: Game) => {
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
          igdbRating: game.rating,
          igdbRatingCount: game.rating_count,
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
        igdbRating: game.rating,
        igdbRatingCount: game.rating_count,
        slug: game.slug,
      };
    });
    await prisma.game.createMany({
      data,
    });
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
