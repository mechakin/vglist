import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../src/server/db";
import igdb from "igdb-api-node";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
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
    const client = igdb(
      process.env.TWITCH_CLIENT_ID,
      process.env.TWITCH_APP_ACCESS_TOKEN
    );
    const maxIGDBResponses = 10;
    const startingOffset = 232221;

    for (let i = 0; i < maxIGDBResponses; i++) {
      const response = await client
        .fields(
          "name,summary,slug,rating,rating_count,first_release_date,cover.url,updated_at"
        )
        .limit(500)
        .offset(startingOffset + i)
        .sort("id", "asc")
        .request("/games");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const formattedResponse: Game[] = response.data;

      formattedResponse.map(async (game: Game) => {
        const url = game.cover?.url;

        let data: PrismaGame;

        if (url) {
          const formattedCoverUrl =
            "https:" + url.replace("t_thumb", "t_cover_big");

          data = {
            id: game.id,
            igdbUpdatedAt: game.updated_at,
            cover: formattedCoverUrl,
            name: game.name,
            slug: game.slug,
            igdbRating: game.rating,
            igdbRatingCount: game.rating_count,
            releaseDate: game.first_release_date,
            summary: game.summary,
          };

          await prisma.game.upsert({
            where: { id: data.id },
            create: data,
            update: data,
          });
        } else {
          data = {
            id: game.id,
            igdbUpdatedAt: game.updated_at,
            cover: game.cover?.url,
            name: game.name,
            slug: game.slug,
            igdbRating: game.rating,
            igdbRatingCount: game.rating_count,
            releaseDate: game.first_release_date,
            summary: game.summary,
          };
          await prisma.game.upsert({
            where: { id: data.id },
            create: data,
            update: data,
          });
        }
      });
    }
  }

  main()
    .then(async () => {
      await prisma.$disconnect();
      return res.status(200).json({ message: "successfully updated database" });
    })
    .catch(async (e: string) => {
      console.error(e);
      await prisma.$disconnect();
      return res.status(500).json({ error: e });
    });
};

export default handler;
