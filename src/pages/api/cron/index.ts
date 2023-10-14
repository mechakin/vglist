import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../src/server/db";
import igdb from "igdb-api-node";
import { env } from "~/env.mjs";
import algoliasearch from "algoliasearch";
import type { Game, PrismaGame, AccessTokenData } from "~/utils/types";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  // should update the offset every month or so
  async function main() {
    const response = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${env.TWITCH_CLIENT_ID}&client_secret=${env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
      { method: "POST" }
    );

    const { access_token } = (await response.json()) as AccessTokenData;

    const client = igdb(process.env.TWITCH_CLIENT_ID, access_token);
    const maxIGDBResponses = 600;
    const startingOffset = 500;

    const searchClient = algoliasearch(
      env.ALGOLIA_APP_ID,
      env.ALGOLIA_ADMIN_API_KEY
    );

    const index = searchClient.initIndex("game");

    for (let i = 0; i < maxIGDBResponses; i++) {
      const response = await client
        .fields(
          "name,summary,slug,rating,rating_count,first_release_date,cover.url,updated_at"
        )
        .limit(500)
        .offset(500 * (startingOffset + i))
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
        }
        await prisma.game.createMany({
          data,
          skipDuplicates: true,
        });

        const algoliaData = { ...data, objectID: data.id };

        const search = await index.saveObject(algoliaData, {});

        console.log(search);
      });
    }
  }

  main()
    .then(async (d) => {
      await prisma.$disconnect();
      return res
        .status(200)
        .json({ message: "successfully updated database", data: d });
    })
    .catch(async (e: string) => {
      console.error(e);
      await prisma.$disconnect();
      return res.status(500).json({ error: e });
    });
};

export default handler;
