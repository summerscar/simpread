---
title: How to Build a Fullstack App with Next.js, Prisma, & PostgreSQL
date: 2023-08-19 15:56:42
---

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [vercel.com](https://vercel.com/guides/nextjs-prisma-postgres)

> Learn how to create and deploy a fullstack application with Next.js, Prisma, PostgreSQL, and Vercel.

[Prisma](https://prisma.io/) is a next-generation ORM that can be used to access a database in Node.js and TypeScript applications. In this guide, you'll learn how to implement a sample fullstack blogging application using the following technologies:

*   [Next.js](https://nextjs.org/) as the React framework
*   [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) for server-side API routes as the backend
*   [Prisma](https://prisma.io/) as the ORM for migrations and database access
*   [Vercel Postgres](https://vercel.com/storage/postgres) as the database
*   [NextAuth.js](https://next-auth.js.org/) for authentication via GitHub (OAuth)
*   [TypeScript](https://www.typescriptlang.org/) as the programming language
*   [Vercel](http://vercel.com/) for deployment

You'll take advantage of the flexible rendering capabilities of Next.js and at the end, you will deploy the app to Vercel.

[Prerequisites](#prerequisites)
-------------------------------

To successfully finish this guide, you'll need:

*   Node.js
*   A Vercel Account (to set up a free Postgres database and deploy the app)
*   A GitHub Account (to create an OAuth app)

[Step 1: Set up your Next.js starter project](#step-1:-set-up-your-next.js-starter-project)
-------------------------------------------------------------------------------------------

Navigate into a directory of your choice and run the following command in your terminal to set up a new Next.js project with the pages router:

```
1

npx create-next-app --example https://github.com/prisma/blogr-nextjs-prisma/tree/main blogr-nextjs-prisma

```

Create and download the starter project from the repo into a new folder.

You can now navigate into the directory and launch the app:

```
1

cd blogr-nextjs-prisma && npm run dev

```

Start the Next.js application at https://localhost:3000.

Here's what it looks like at the moment:

![](https://vercel.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F2urWoZq7yHkEhi93PPJXD4%2Fec4c90b45389261b215a499f24caaeb4%2F1.png&w=3840&q=75&dpl=dpl_9TLEuhXH7rWJVSMizpWKiDWzH9Es)

Current state of the application.

The app currently displays hardcoded data that's returned from `getStaticProps` in the `index.tsx` file. Over the course of the next few sections, you'll change this so that the data is returned from an actual database.

[Step 2: Set up your Vercel Postgres database](#step-2:-set-up-your-vercel-postgres-database)
---------------------------------------------------------------------------------------------

For the purpose of this guide, we'll use a free Postgres database hosted on Vercel. First, push the repo you cloned in Step 1 to our own GitHub and deploy it to Vercel to create a Vercel project.

Once you have a Vercel project, select the **Storage** tab, then select the **Connect Database** button. Under the **Create New** tab, select **Postgres** and then the **Continue** button.

To create a new database, do the following in the dialog that opens:

1.  Enter `sample_postgres_db` (or any other name you wish) under **Store Name**. The name can only contain alphanumeric letters, "_" and "-" and can't exceed 32 characters.
2.  Select a region. We recommend choosing a region geographically close to your function region (defaults to US East) for reduced latency.
3.  Click **Create**.

Our empty database is created in the region specified. Because you created the Postgres database in a project, we automatically created and added the following environment variables to the project for you.

After running `npm i -g vercel@latest` to install the Vercel CLI, pull down the latest environment variables to get your local project working with the Postgres database.

```
1

vercel env pull .env.local

```

Pull down all the required environment variables locally from the Vercel project

We now have a fully functioning Vercel Postgres database and have all the environment variables to run it locally and on Vercel.

[Step 3: Setup Prisma and create the database schema](#step-3:-setup-prisma-and-create-the-database-schema)
-----------------------------------------------------------------------------------------------------------

Next, you will set up Prisma and connect it to your PostgreSQL database. Start by installing the Prisma CLI via npm:

```
1

npm install prisma --save-dev

```

Install the Prisma CLI.

You'll now create the tables in your database using the Prisma CLI.

To do this, create a prisma folder and add a file called `schema.prisma,` your main Prisma configuration file that will contain your database schema.

Add the following model definitions to your `schema.prisma` so that it looks like this:

```
4

  provider = "prisma-client-js"

5

  previewFeatures = ["jsonProtocol"]

9

  provider = "postgresql"

10

  url = env("POSTGRES_PRISMA_URL") // uses connection pooling

11

  directUrl = env("POSTGRES_URL_NON_POOLING") // uses a direct connection

15

  id        String     @default(cuid()) @id

18

  published Boolean @default(false)

19

  author    User?   @relation(fields: [authorId], references: [id])

24

  id            String       @default(cuid()) @id

27

  createdAt     DateTime  @default(now()) @map(name: "created_at")

28

  updatedAt     DateTime  @updatedAt @map(name: "updated_at")

```

The Prisma schema.

**Note:** You're occasionally using [`@map`](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference/#map)and[`@@map`](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference/#map-1)to map some field and model names to different column and table names in the underlying database. This is because NextAuth.js has some special [requirements](https://authjs.dev/reference/adapter/prisma#naming-conventions) for calling things in your database a certain way.

This Prisma schema defines two _models_, each of which will map to a _table_ in the underlying database: `User` and `Post`. Notice that there's also a relation (one-to-many) between the two models, via the `author` field on `Post` and the `posts` field on `User`.

To actually create the tables in your database, you now can use the following command of the Prisma CLI:

Create the tables in your database based on your Prisma schema.

You should see the following output:

```
1

Environment variables loaded from /Users/nikolasburk/Desktop/nextjs-guide/blogr-starter/.env.development.local

2

Prisma schema loaded from prisma/schema.prisma

4

🚀  Your database is now in sync with your schema. Done in 2.10s

```

Output from pushing your Prisma schema to your database.

Congratulations, the tables have been created! Go ahead and add some initial dummy data using Prisma Studio. Run the following command:

Open Prisma Studio, a GUI for modifying your database.

Use Prisma Studio's interface to create a new `User` and `Post` record and connect them via their relation fields.

![](https://vercel.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F4Xv0gxUZulUcEbkx44meID%2F35c49dbd5d8e10e3796e920e1270df7f%2F2.png&w=3840&q=75&dpl=dpl_9TLEuhXH7rWJVSMizpWKiDWzH9Es)

Create a new `User` record

![](https://vercel.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F4gg9hkQjCaRfZuGPNrD7Ao%2Ff35ec469a65f168970d190f46dd20872%2F3.png&w=3840&q=75&dpl=dpl_9TLEuhXH7rWJVSMizpWKiDWzH9Es)

Create a new `Post` record and connect it to the `User` record

[Step 4. Install and generate Prisma Client](#step-4.-install-and-generate-prisma-client)
-----------------------------------------------------------------------------------------

Before you can access your database from Next.js using Prisma, you first need to install Prisma Client in your app. You can install it via npm as follows:

```
1

npm install @prisma/client

```

Install the Prisma Client package.

Because Prisma Client is _tailored_ to your own schema, you need to update it every time your Prisma schema file is changing by running the following command:

Regenerate your Prisma Schema.

You'll use a single `PrismaClient` instance that you can import into any file where it's needed. The instance will be created in a `prisma.ts` file inside the `lib/` directory. Go ahead and create the missing directory and file:

```
1

mkdir lib && touch lib/prisma.ts

```

Create a new folder for the Prisma library.

Now, add the following code to this file:

```
1

import { PrismaClient } from '@prisma/client';

3

let prisma: PrismaClient;

5

if (process.env.NODE_ENV === 'production') {

6

  prisma = new PrismaClient();

9

    global.prisma = new PrismaClient();

11

  prisma = global.prisma;

```

Create a connection to your Prisma Client.

Now, whenever you need access to your database you can import the `prisma` instance into the file where it's needed.

[Step 5. Update the existing views to load data from the database](#step-5.-update-the-existing-views-to-load-data-from-the-database)
-------------------------------------------------------------------------------------------------------------------------------------

The blog post feed that's implemented in `pages/index.tsx` and the post detail view in `pages/p/[id].tsx` are currently returning hardcoded data. In this step, you'll adjust the implementation to return data from the database using Prisma Client.

Open `pages/index.tsx` and add the following code right below the existing `import` declarations:

```
1

import prisma from '../lib/prisma';

```

Import your Prisma Client.

Your `prisma` instance will be your interface to the database when you want to read and write data in it. You can for example create a new `User` record by calling `prisma.user.create()` or retrieve all the `Post` records from the database with `prisma.post.findMany()`. For an overview of the full Prisma Client API, visit the [Prisma docs](https://www.prisma.io/docs/concepts/components/prisma-client/crud).

Now you can replace the hardcoded `feed` object in `getStaticProps` inside `index.tsx` with a proper call to the database:

```
1

export const getStaticProps: GetStaticProps = async () => {

2

  const feed = await prisma.post.findMany({

3

    where: { published: true },

6

        select: { name: true },

```

Find all published posts in your database.

The two things to note about the Prisma Client query:

*   A `where` filter is specified to include only `Post` records where `published` is `true`
*   The `name` of the `author` of the `Post` record is queried as well and will be included in the returned objects

Before running the app, head over to `/pages/p/[id].tsx` and adjust the implementation there as well to read the correct `Post` record from the database.

This page uses `getServerSideProps` (SSR) instead of `getStaticProps` (SSG). This is because the data is _dynamic_, it depends on the `id` of the `Post` that's requested in the URL. For example, the view on route `/p/42` displays the `Post` where the `id` is `42`.

Like before, you first need to import Prisma Client on the page:

```
1

import prisma from '../../lib/prisma';

```

Import your Prisma Client.

Now you can update the implementation of `getServerSideProps` to retrieve the proper post from the database and make it available to your frontend via the component's `props`:

```
1

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

2

  const post = await prisma.post.findUnique({

4

      id: String(params?.id),

8

        select: { name: true },

```

Find a specific post based on the ID.

That's it! If your app is not running any more, you can restart it with the following command:

Start your application at http://localhost:3000.

Otherwise, save the files and open the app at `http://localhost:3000` in your browser. The `Post` record will be displayed as follows:

![](https://vercel.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F11i7qnImXEGxOifqJgTbSJ%2Fc4a13562edb18c54a3c39b28898c8459%2F4.png&w=3840&q=75&dpl=dpl_9TLEuhXH7rWJVSMizpWKiDWzH9Es)

Your newly published post.

You can also click on the post to navigate to its detail view.

[Step 6. Set up GitHub authentication with NextAuth](#step-6.-set-up-github-authentication-with-nextauth)
---------------------------------------------------------------------------------------------------------

In this step, you will add GitHub authentication to the app. Once that functionality is available, you'll add more features to the app, such that authenticated users can create, publish and delete posts via the UI.

As a first step, go ahead and install the NextAuth.js library in your app:

```
1

npm install next-auth@4 @next-auth/prisma-adapter

```

Install the NextAuth library and the NextAuth Prisma Adapter.

Next, you need to change your database schema to add the missing tables that are [required by NextAuth](https://next-auth.js.org/getting-started/upgrade-v4#postgres).

To change your database schema, you can manually make changes to your Prisma schema and then run the `prisma db push` command again. Open `schema.prisma` and adjust the models in it to look as follows:

```
4

  id        String  @id @default(cuid())

7

  published Boolean @default(false)

8

  author    User?@relation(fields:[authorId], references:[id])

12

  id                 String  @id @default(cuid())

13

  userId             String  @map("user_id")

16

  providerAccountId  String  @map("provider_account_id")

24

  oauth_token_secret String?

27

  user User @relation(fields:[userId], references:[id], onDelete: Cascade)

29

  @@unique([provider, providerAccountId])}

32

  id           String   @id @default(cuid())

33

  sessionToken String   @unique@map("session_token")

34

  userId       String   @map("user_id")

36

  user         User     @relation(fields:[userId], references:[id], onDelete: Cascade)}

39

  id            String    @id @default(cuid())

42

  emailVerified DateTime?

48

model VerificationToken {

49

  id         Int      @id @default(autoincrement())

54

  @@unique([identifier, token])}

```

Updated Prisma schema.

To learn more about these models, visit the [NextAuth.js docs](https://next-auth.js.org/schemas/models).

Now you can adjust your database schema by creating the actual tables in the database. Run the following command:

Update the tables in your database based on your Prisma schema.

Since you're using GitHub authentication, you also need to create a new [OAuth app on GitHub](https://docs.github.com/en/free-pro-team@latest/developers/apps/building-oauth-apps). First, log into your [GitHub](https://github.com/) account. Then, navigate to [**Settings**](https://github.com/settings/profile), then open to [**Developer Settings**](https://github.com/settings/apps), then switch to [**OAuth Apps**](https://github.com/settings/developers).

![](https://vercel.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F42WGp7BsBEk2we6u3nx9O7%2F1bea8b695cf0e40081b7f2187244791b%2F5.png&w=3840&q=75&dpl=dpl_9TLEuhXH7rWJVSMizpWKiDWzH9Es)

Create a new OAuth application inside GitHub.

Clicking on the **Register a new application** (or **New OAuth App**) button will redirect you to a registration form to fill out some information for your app. The **Authorization callback URL** should be the Next.js `/api/auth` route: `http://localhost:3000/api/auth`.

An important thing to note here is that the **Authorization callback URL** field only supports a single URL, unlike e.g. Auth0, which allows you to add additional callback URLs separated with a comma. This means if you want to deploy your app later with a production URL, you will need to set up a new GitHub OAuth app.

![](https://vercel.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F1N0WpTZ8HAR9k7qSVpfgfl%2F8854fd577bf09916b88493b8734db245%2F6.png&w=3840&q=75&dpl=dpl_9TLEuhXH7rWJVSMizpWKiDWzH9Es)

Ensure your Authorization callback URL is correct.

Click on the **Register application** button, and then you will be able to find your newly generated **Client ID** and **Client Secret**. Copy and paste this info into the `.env` file in the root directory as the `GITHUB_ID` and `GITHUB_SECRET` env vars. Also set the `NEXTAUTH_URL` to the same value of the **Authorization callback URL** thar you configured on GitHub: `http://localhost:3000/api/auth`

```
4

GITHUB_ID=6bafeb321963449bdf51

5

GITHUB_SECRET=509298c32faa283f28679ad6de6f86b2472e1bff

6

NEXTAUTH_URL=http://localhost:3000/api/auth

```

The completed .env file.

You will also need to persist a user's authentication state across the entire application. Make a quick change in your application's root file `_app.tsx` and wrap your current root component with a `SessionProvider` from the `next-auth/react` package. Open the file and replace its current contents with the following code:

```
1

import { SessionProvider } from 'next-auth/react';

2

import { AppProps } from 'next/app';

4

const App = ({ Component, pageProps }: AppProps) => {

6

    <SessionProvider session={pageProps.session}>

7

      <Component {...pageProps} />

```

Wrap your application with the NextAuth SessionProvider.

[Step 7. Add Log In functionality](#step-7.-add-log-in-functionality)
---------------------------------------------------------------------

The login button and some other UI components will be added to the `Header.tsx` file. Open the file and paste the following code into it:

```
1

import React from 'react';

2

import Link from 'next/link';

3

import { useRouter } from 'next/router';

4

import { signOut, useSession } from 'next-auth/react';

6

const Header: React.FC = () => {

7

  const router = useRouter();

8

  const isActive: (pathname: string) => boolean = (pathname) =>

9

    router.pathname === pathname;

11

  const { data: session, status } = useSession();

14

    <div class>

16

        <a class data-active={isActive('/')}>

26

          text-decoration: none;

27

          color: var(--geist-foreground);

28

          display: inline-block;

31

        .left a[data-active='true'] {

44

  if (status === 'loading') {

46

      <div class>

48

          <a class data-active={isActive('/')}>

58

            text-decoration: none;

59

            color: var(--geist-foreground);

60

            display: inline-block;

63

          .left a[data-active='true'] {

74

      <div class>

75

        <p>Validating session ...</p>

87

      <div class>

88

        <Link href="/api/auth/signin">

89

          <a data-active={isActive('/signup')}>Log in</a>

93

            text-decoration: none;

94

            color: var(--geist-foreground);

95

            display: inline-block;

107

            border: 1px solid var(--geist-foreground);

108

            padding: 0.5rem 1rem;

118

      <div class>

120

          <a class data-active={isActive('/')}>

124

        <Link href="/drafts">

125

          <a data-active={isActive('/drafts')}>My drafts</a>

133

            text-decoration: none;

134

            color: var(--geist-foreground);

135

            display: inline-block;

138

          .left a[data-active='true'] {

149

      <div class>

151

          {session.user.name} ({session.user.email})

153

        <Link href="/create">

158

        <button onClick={() => signOut()}>

163

            text-decoration: none;

164

            color: var(--geist-foreground);

165

            display: inline-block;

169

            display: inline-block;

183

            border: 1px solid var(--geist-foreground);

184

            padding: 0.5rem 1rem;

211

export default Header;

```

Allow the user to log in through the Header.

Here's an overview of how the header is going to render:

*   If no user is authenticated, a **Log in** button will be shown.
*   If a user is authenticated, **My drafts**, **New Post** and **Log out** buttons will be shown.

You can already run the app to validate that this works by running `npm run dev`, you'll find that the **Log in** button is now shown. However, if you click it, it does navigate you to `http://localhost:3000/api/auth/signin` but Next.js is going to render a 404 page for you.

That's because [NextAuth.js requires you to set up a specific route for authentication](https://next-auth.js.org/configuration/pages). You'll do that next.

Create a new directory and a new file in the `pages/api` directory:

```
1

mkdir -p pages/api/auth && touch pages/api/auth/[...nextauth].ts

```

Create a new directory and API route.

In this new `pages/api/auth/[...nextauth].ts` file, you now need to add the following boilerplate to configure your NextAuth.js setup with your GitHub OAuth credentials and the [Prisma adapter](https://next-auth.js.org/schemas/adapters#prisma-adapter):

```
1

import { NextApiHandler } from 'next';

2

import NextAuth from 'next-auth';

3

import { PrismaAdapter } from '@next-auth/prisma-adapter';

4

import GitHubProvider from 'next-auth/providers/github';

5

import prisma from '../../../lib/prisma';

7

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);

8

export default authHandler;

13

      clientId: process.env.GITHUB_ID,

14

      clientSecret: process.env.GITHUB_SECRET,

17

  adapter: PrismaAdapter(prisma),

18

  secret: process.env.SECRET,

```

Set up NextAuth, including the Prisma Adapter.

Once the code is added, you can navigate to `http://localhost:3000/api/auth/signin` again. This time, the **Sign in with GitHub** button is shown.

![](https://vercel.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F4kQ9bV1IGBC43DwzvuT1p0%2F2725db72dd59860dc3ace3ee35331e43%2F7.png&w=3840&q=75&dpl=dpl_9TLEuhXH7rWJVSMizpWKiDWzH9Es)

Sign in with GitHub using NextAuth.

If you click it, you're forwarded to GitHub, where you can authenticate with your GitHub credentials. Once the authentication is done, you'll be redirected back into the app.

**Note:** If you're seeing an error and could not be authenticated, stop the app and re-run it with `npm run dev`.

The header layout has now changed to display the buttons for authenticated users.

![](https://vercel.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F42h50fNeDIOpA6YEH5MVUg%2Fe6f7f16ddbe32520e24bb3dcc107f760%2F8.png&w=3840&q=75&dpl=dpl_9TLEuhXH7rWJVSMizpWKiDWzH9Es)

The Header displaying a log out button.

[Step 8. Add new post functionality](#step-8.-add-new-post-functionality)
-------------------------------------------------------------------------

In this step, you'll implement a way for a user to create a new post. The user can use this feature by clicking the **New post** button once they're authenticated.

The button already forwards to the `/create` route, however, this currently leads to a 404 because that route is not implemented yet.

To fix that, create a new file in the pages directory that's called `create.tsx`:

Create a new file for creating posts.

Now, add the following code to the newly created file:

```
1

import React, { useState } from 'react';

2

import Layout from '../components/Layout';

3

import Router from 'next/router';

5

const Draft: React.FC = () => {

6

  const [title, setTitle] = useState('');

7

  const [content, setContent] = useState('');

9

  const submitData = async (e: React.SyntheticEvent) => {

18

        <form onSubmit={submitData}>

22

            onChange={(e) => setTitle(e.target.value)}

29

            onChange={(e) => setContent(e.target.value)}

34

          <input disabled={!content || !title} type="submit" value="Create" />

35

          <a class onClick={() => Router.push('/')}>

42

          background: var(--geist-background);

45

          justify-content: center;

54

          border-radius: 0.25rem;

55

          border: 0.125rem solid rgba(0, 0, 0, 0.2);

58

        input[type='submit'] {

```

A new component to create posts.

This page is wrapped by the `Layout` component so that it still includes the `Header` and any other generic UI components.

It renders a form with several input fields. When submitted, the (right now empty) `submitData` function is called. In that function, you need to pass the data from the React component to an API route which can then handle the actual storage of the new post data in the database.

Here's how you can implement the function:

```
1

const submitData = async (e: React.SyntheticEvent) => {

4

    const body = { title, content };

5

    await fetch('/api/post', {

7

      headers: { 'Content-Type': 'application/json' },

8

      body: JSON.stringify(body),

10

    await Router.push('/drafts');

```

Call your API route to create a post.

In this code, you're using the `title` and `content` properties that are extracted from the component state using `useState` and submit them via an HTTP POST request to the `api/post` API route.

Afterwards, you're redirecting the user to the `/drafts` page so that they can immediately see their newly created draft. If you run the app, the `/create` route renders the following UI:

![](https://vercel.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F282p7LTOlQRXTV4CJzzfxa%2F15b5b92f4ebfb31d791ea5f651503dc0%2F9.png&w=3840&q=75&dpl=dpl_9TLEuhXH7rWJVSMizpWKiDWzH9Es)

Create a new draft.

Note however that the implementation doesn't quite work yet because neither `api/post` nor the `/drafts` route exist so far. You'll implement these next.

First, let's make sure your backend can handle the POST request that's submitted by the user. Thanks to the [Next.js API routes](https://nextjs.org/docs/api-routes/introduction) feature, you don't have to"leave your Next.js app" to implement such functionality but instead you can add it to your `pages/api` directory.

Create a new directory called `post` with a new file called `index.ts`:

```
1

mkdir -p pages/api/post && touch pages/api/post/index.ts

```

Create a new API route to create a post.

**Note:** At this point, you could also have created a file called `pages/api/post.ts`` instead of taking the detour with an extra directory and an `index.ts` file. The reason why you're not doing it that way is because you'll need to add a dynamic route for HTTP `DELETE` requests at the `api/post` route later as well. In order to save some refactoring later, you're already structuring the files in the required way.

Now, add the following code to `pages/api/post/index.ts`:

```
1

import { getSession } from 'next-auth/react';

2

import prisma from '../../../lib/prisma';

7

export default async function handle(req, res) {

8

  const { title, content } = req.body;

10

  const session = await getSession({ req });

11

  const result = await prisma.post.create({

15

      author: { connect: { email: session?.user?.email } },

```

Update the API route to modify the database using the Prisma Client.

This code implements the _handler_ function for any requests coming in at the `/api/post/` route. The implementation does the following: First it extracts the `title` and `cotent` from the body of the incoming HTTP POST request. After that, it checks whether the request is coming from an authenticated user with the `getSession` helper function from NextAuth.js. And finally, it uses Prisma Client to create a new `Post` record in the database.

You can now test this functionality by opening the app, making sure you're authenticated and create a new post with title and content:

![](https://vercel.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F2Z41gYOddxIlo6KwqswDPd%2F99eca6c7deaf23d437c71c8646b7444a%2F10.png&w=3840&q=75&dpl=dpl_9TLEuhXH7rWJVSMizpWKiDWzH9Es)

Testing creating a new post via the API Route.

Once you click **Create**, the `Post` record will be added to the database. Note that the `/drafts` route that you're being redirected to right after the creation still renders a 404, that will be fixed soon. However, if you run Prisma Studio again with `npx prisma studio`, you'll see that the new `Post` record has been added to the database.

[Step 9. Add drafts functionality](#step-9.-add-drafts-functionality)
---------------------------------------------------------------------

In this step, you'll add a new page to the app that allows an authenticated user to view their current _drafts_.

This page can't be statically rendered because it depends on a user who is authenticated. Pages like this that get their data _dynamically_ based on an authenticated users are a great use case for server-side rendering (SSR) via `getServerSideProps`.

First, create a new file in the `pages` directory and call it `drafts.tsx`:

Create a new page for your drafts.

Next, add the following code to that file:

```
1

import React from 'react';

2

import { GetServerSideProps } from 'next';

3

import { useSession, getSession } from 'next-auth/react';

4

import Layout from '../components/Layout';

5

import Post, { PostProps } from '../components/Post';

6

import prisma from '../lib/prisma';

8

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

9

  const session = await getSession({ req });

12

    return { props: { drafts: [] } };

15

  const drafts = await prisma.post.findMany({

17

      author: { email: session.user.email },

22

        select: { name: true },

35

const Drafts: React.FC<Props> = (props) => {

36

  const { data: session } = useSession();

42

        <div>You need to be authenticated to view this page.</div>

49

      <div class>

52

          {props.drafts.map((post) => (

53

            <div key={post.id} class>

61

          background: var(--geist-background);

62

          transition: box-shadow 0.1s ease-in;

66

          box-shadow: 1px 1px 3px #aaa;

```

Update the Draft page to show a list of drafts.

In this React component, you're rendering a list of"drafts" of the authenticated user. The drafts are retrieved from the database during server-side rendering, because the database query with Prisma Client is executed in `getServerSideProps`. The data is then made available to the React component via its `props`.

If you now navigate to the **My drafts** section of the app, you'll see the unpublished post that you created before:

![](https://vercel.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F221Ve9cFpuAu9zBKZVjaWJ%2Fcd6fe2068b187c30220a8f868b767c35%2F11.png&w=3840&q=75&dpl=dpl_9TLEuhXH7rWJVSMizpWKiDWzH9Es)

Completed drafts page.

[Step 10. Add Publish functionality](#step-10.-add-publish-functionality)
-------------------------------------------------------------------------

To "move" the draft to the public feed view, you need to be able to "publish" it – that is, setting the `published` field of a `Post` record to `true`. This functionality will be implemented in the post detail view that currently lives in `pages/p/[id].tsx`.

The functionality will be implemented via an HTTP PUT request that'll be sent to a `api/publish` route in your "Next.js backend". Go ahead and implement that route first.

Create a new directory inside the `pages/api` directory called `publish`. Then create a new file called `[id].ts` in the new directory:

```
1

mkdir -p pages/api/publish && touch pages/api/publish/[id].ts

```

Create a new API route to publish a post.

Now, add the following code to the newly created file:

```
1

import prisma from '../../../lib/prisma';

4

export default async function handle(req, res) {

5

  const postId = req.query.id;

6

  const post = await prisma.post.update({

8

    data: { published: true },

```

Update the API route to modify the database using the Prisma Client.

This is the implementation of an API route handler which retrieves the ID of a `Post` from the URL and then uses Prisma Client's `update` method to set the `published` field of the `Post` record to `true`.

Next, you'll implement the functionality on the frontend in the `pages/p/[id].tsx` file. Open up the file and replace its contents with the following:

```
1

import React from 'react';

2

import { GetServerSideProps } from 'next';

3

import ReactMarkdown from 'react-markdown';

4

import Router from 'next/router';

5

import Layout from '../../components/Layout';

6

import { PostProps } from '../../components/Post';

7

import { useSession } from 'next-auth/react';

8

import prisma from '../../lib/prisma';

10

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

11

  const post = await prisma.post.findUnique({

13

      id: String(params?.id),

17

        select: { name: true, email: true },

26

async function publishPost(id: string): Promise<void> {

27

  await fetch(`/api/publish/${id}`, {

30

  await Router.push('/');

33

const Post: React.FC<PostProps> = (props) => {

34

  const { data: session, status } = useSession();

35

  if (status === 'loading') {

36

    return <div>Authenticating ...</div>;

38

  const userHasValidSession = Boolean(session);

39

  const postBelongsToUser = session?.user?.email === props.author?.email;

40

  let title = props.title;

41

  if (!props.published) {

42

    title = `${title} (Draft)`;

49

        <p>By {props?.author?.name || 'Unknown author'}</p>

50

        <ReactMarkdown children={props.content} />

51

        {!props.published && userHasValidSession && postBelongsToUser && (

52

          <button onClick={() => publishPost(props.id)}>Publish</button>

57

          background: var(--geist-background);

68

          border-radius: 0.125rem;

```

Update the Post component to handle publishing via the API Route.

This code adds the `publishPost` function to the React component which is responsible for sending the HTTP PUT request to the API route you just implemented. The `render` function of the component is also adjusted to check whether the user is authenticated, and if that's the case, it'll display the **Publish** button in the post detail view as well:

![](https://vercel.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F1Ohdg5zNejFfXxwWAe6hpR%2F1d7a7059cb51bf3d6f29a66caafd884f%2F12.png&w=3840&q=75&dpl=dpl_9TLEuhXH7rWJVSMizpWKiDWzH9Es)

The publish button shown for a post.

If you click the button, you will be redirected to the public feed and the post will be displayed there!

**Note:** Once the app is deployed to production, the feed will be updated at most every 10 seconds when it receives a request. That's because you're using static site generation (SSG) via `getStaticProps` to retrieve the data for this view with [Incremental Static Regeneration](https://vercel.com/docs/basic-features/data-fetching/incremental-static-regeneration). If you want data to be updated "immediately", consider using [On-Demand Incremental Static Regeneration](https://vercel.com/docs/concepts/incremental-static-regeneration/quickstart).

[Step 11. Add Delete functionality](#step-11.-add-delete-functionality)
-----------------------------------------------------------------------

The last piece of functionality you'll implement in this guide is to enable users to delete existing `Post` records. You'll follow a similar approach as for the"publish" functionality by first implementing the API route handler on the backend, and then adjust your frontend to make use of the new route!

Create a new file in the `pages/api/post` directory and call it `[id].ts`:

```
1

touch pages/api/post/[id].ts

```

Create a new API route to delete a post.

Now, add the following code to it:

```
1

import prisma from '../../../lib/prisma';

4

export default async function handle(req, res) {

5

  const postId = req.query.id;

6

  if (req.method === 'DELETE') {

7

    const post = await prisma.post.delete({

13

      `The HTTP ${req.method} method is not supported at this route.`,

```

Update the API route to modify the database using the Prisma Client.

This code handles HTTP `DELETE` requests that are coming in via the `/api/post/:id` URL. The route handler then retrieves the `id` of the `Post` record from the URL and uses Prisma Client to delete this record in the database.

To make use of this feature on the frontend, you again need to adjust the post detail view. Open `pages/p/[id].tsx` and insert the following function right below the `publishPost` function:

```
1

async function deletePost(id: string): Promise<void> {

2

  await fetch(`/api/post/${id}`, {

```

Update the Post component to handle deleting via the API Route.

Now, you can follow a similar approach with the **Delete** button as you did with the **Publish** button and render it only if the user is authenticated. To achieve this, you can add this code directly in the `return` part of the `Post` component right below where the **Publish** button is rendered:

```
3

  !props.published && userHasValidSession && postBelongsToUser && (

4

    <button onClick={() => publishPost(props.id)}>Publish</button>

8

  userHasValidSession && postBelongsToUser && (

9

    <button onClick={() => deletePost(props.id)}>Delete</button>

```

Logic to determine whether to show the publish and delete buttons.

You can now try out the new functionality by creating a new draft, navigating to its detail view and then clicking the newly appearing **Delete** button:

![](https://vercel.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F5yf3vrKOb7i56gMZY7zJQA%2F94975799afd8fa6cbe460e9301bc389d%2F13.png&w=3840&q=75&dpl=dpl_9TLEuhXH7rWJVSMizpWKiDWzH9Es)

The Delete button showing on the post page.

[Step 12. Deploy to Vercel](#step-12.-deploy-to-vercel)
-------------------------------------------------------

In this final step, you're going to deploy the app to Vercel from a GitHub repo.

Before you can deploy, you need to:

*   Create another OAuth app on GitHub
*   Create a new GitHub repo and push your project to it

To start with the OAuth app, go back to step "Step 5. Set up GitHub authentication with NextAuth" and follow the steps to create another OAuth app via the GitHub UI.

This time, the **Authorization Callback URL** needs to match the domain of your future Vercel deployment which will be based on the Vercel project name. As a Vercel project name, you will choose `blogr-nextjs-prisma` prepended with your first and lastname: `FIRSTNAME-LASTNAME-blogr-nextjs-prisma`. For example, if you're called"Jane Doe", your project name should be `jane-doe-blogr-nextjs-prisma`.

**Note:** Prepending your first and last name is required to ensure the uniqueness of your deployment URL.

The **Authorization Callback URL** must therefore be set to `https://FIRSTNAME-LASTNAME-blogr-nextjs-prisma.vercel.app/api/auth`. Once you created the application, adjust your `.env` file and set the **Client ID** as the `GITHUB_ID` env var and a **Client secret** as the `GITHUB_SECRET` env var. The `NEXTAUTH_URL` env var needs to be set to the same value as the **Authorization Callback URL** on GitHub: `https://FIRSTNAME-LASTNAME-blogr-nextjs-prisma.vercel.app/api/auth`.

![](https://vercel.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F4eKx9gXLs1BDg0UpX6pfsz%2Fd3fe7b9905a49f3913b8528449f161d3%2F14.png&w=3840&q=75&dpl=dpl_9TLEuhXH7rWJVSMizpWKiDWzH9Es)

Update the Authorization callback URL.

Next, create a new GitHub repository with the same name, e.g. `jane-doe-blogr-nextjs-prisma`. Now, copy the three terminal commands from the bottom section that says **...or push an existing repository from the command line**, it should look similar to this:

```
1

git remote add origin git@github.com:janedoe/jane-doe-blogr-nextjs-prisma.git

```

Push to an existing repository.

You now should have your new repository ready at `https://github.com/GITHUB_USERNAME/FIRSTNAME-LASTNAME-blogr-nextjs-prisma`, e.g. `https://github.com/janedoe/jane-doe-blogr-nextjs-prisma`.

With the GitHub repo in place, you can now import it to Vercel in order to deploy the app:

[![](https://images.ctfassets.net/e5382hct74si/1MBW5fsAqJiqhbfdOPKzzm/96dc8bdc471276d0a086fee9c475890b/button.svg)](https://vercel.com/import/git?env=DATABASE_URL,GITHUB_ID,GITHUB_SECRET,NEXTAUTH_URL)

Now, provide the URL of your GitHub repo in the text field:

![](https://vercel.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F3B7J88ffcf3qs9Bha2dXzM%2F0cb1d6a68e7aeacb2d4e0b4cad8abe8d%2F15.png&w=3840&q=75&dpl=dpl_9TLEuhXH7rWJVSMizpWKiDWzH9Es)

Import a git repository to Vercel.

Click **Continue**. The next screen requires you to set the environment variables for your production deployment:

![](https://vercel.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F5sGJJuC4IwP36gk1bKUpqP%2Fa6ca4c68a304336a11a3961918f31639%2F16.png&w=3840&q=75&dpl=dpl_9TLEuhXH7rWJVSMizpWKiDWzH9Es)

Add environment variables to Vercel.

Here's what you need to provide:

*   `GITHUB_ID`: Set this to the **Client ID** of the GitHub OAuth app you just created
*   `GITHUB_SECRET`: Set this to the **Client Secret** of the GitHub OAuth app you just created
*   `NEXTAUTH_URL`: Set this to the **Authorization Callback URL** of the GitHub OAuth app you just created
*   `SECRET`: Set this to your own strong secret. This was not needed in development as NextAuth.js will generate one if not provided. However, you will need to provide your own value for production otherwise you will receive an error.

You'll also need to link your Vercel postgres database to this Vercel project so that all your database environment variables are automatically added. Once all environment variables are set, hit **Deploy**. Your app is now being deployed to Vercel. Once it's ready, Vercel will show you the following success screen:

![](https://vercel.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2Fyrw2Jce5AvD3uaa1zZWUl%2Fb28ccffc1601fd441cee1f21a504fc1c%2F17.png&w=3840&q=75&dpl=dpl_9TLEuhXH7rWJVSMizpWKiDWzH9Es)

Your application deployed to Vercel.

You can click the **Visit** button to view the deployed version of your fullstack app 🎉

[Conclusion](#conclusion)
-------------------------

In this guide, you learned how to build and deploy a fullstack application using Next.js, Prisma, and Vercel Postgres. If you ran into issue or have any questions about this guide, feel free to raise them on [GitHub](https://github.com/prisma/prisma/discussions) or drop them in the [Prisma Slack](https://slack.prisma.io/).