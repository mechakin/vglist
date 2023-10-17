# VGList

![demo](https://media.discordapp.net/attachments/1106206570091663410/1163612175890395246/demo-2.png?ex=65403549&is=652dc049&hm=d914d2fcfc73bae1dd7cbc8c137189a318f3a738b8c80581df9bb830bebfffa0&=&width=954&height=537)

## About

Couture is an e-commerce website that offers a curated collection of high-end fashion and accessories.

To contribute you will first need to fork the repo and make some adjustments to get it up and running on your local machine. Below are the steps to follow for you to get TypeHero to run on your local machine.

1. Create a `sh.env` file
   Provide your values as needed. The .env values can be seen in the `sh.env.example` file.

2. Configure your database
   You can use PlanetScale to run your database by [following this link.](https://planetscale.com/docs/tutorials/planetscale-quick-start-guide) After creating an account and creating a database, click the big connect button, select connect with Prisma and then copy the `sh DATABASE_URL` for your `sh .env ` file.

3. Create a new Clerk application
   [Follow this link](https://clerk.com/docs/quickstarts/setup-clerk) to create a new app. Make sure to select user sign in on email address, Discord, and Twitch.

   Next, copy the `sh NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `sh CLERK_SECRET_KEY` into the `sh.env` file. Once copied, set up your social connections for [Twitch](https://clerk.com/docs/authentication/social-connections/twitch) and [Discord](https://clerk.com/docs/authentication/social-connections/discord).

4. Set up a new Algolia application
   Follow this link to [create a new app](https://dashboard.algolia.com/users/sign_in). Copy the `Application ID` and the `Admin API Key` values on your `.env` file.

In the end your local `.env` file should look something like the following

DATABASE_URL='mysql://dev:dev@localhost/vglist'
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_real_value
CLERK_SECRET_KEY=sk_test_real_value
TWITCH_CLIENT_ID=real_client_id
TWITCH_CLIENT_SECRET=real_client_secret
ALGOLIA_APP_ID=real_app_id
ALGOLIA_ADMIN_API_KEY=real_admin_api_key

5. Install dependencies
   Use pnpm to install dependencies.

   ```
   pnpm install
   ```

6. Push database schema and seed

   ```
   pnpm prisma db push
   pnpm db-seed
   ```

7. Running the dev server
   Finally, you can run the dev server:

   ```
   pnpm dev
   ```