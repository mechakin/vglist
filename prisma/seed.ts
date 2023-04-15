// import { env } from "~/env.mjs";
// import { prisma } from "../src/server/db";
// import igdb from 'igdb-api-node';

// async function main() {
//   const client = igdb(env.TWITCH_CLIENT_ID, env.TWITCH_APP_ACCESS_TOKEN);
//   const response = client.fields('game')
  
//   const id = "cl9ebqhxk00003b600tymydho";
//   await prisma.game.upsert({
//     where: {
//       id,
//     },
//     create: {
//       id,
//     },
//     update: {},
//   });
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
  