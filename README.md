# mms-main

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## MMS Image Library

The `public/mms` folder includes visual assets grouped around the main offerings of this site:

- **Weddings & events**: celebration photography, wedding portraits, sparkler exits, and intimate event storytelling.
- **Conferences & production**: large-screen setups, conference halls, video conferencing, live event staging, and AV presentation hardware.
- **Destination & scenic visuals**: Victoria Falls, bridges, aerial landscapes, and immersive travel locations.
- **Creative marketing & branding**: social media campaign imagery, design workspace scenes, ad visuals, and promotional content.
- **Technical & equipment showcases**: production gear, spark machines, LED presentation monitors, and event technology packages.

These images support the page's portfolio, services, and gallery sections.

## Getting Started

For a beginner-friendly, step-by-step explanation of installing the project, creating the database, applying migrations, seeding content, and starting the website, read [START_PROJECT_GUIDE.md](./START_PROJECT_GUIDE.md).

### Backend setup

The contact form, conference enquiry, project builder, and inbound WhatsApp messages all persist to PostgreSQL before provider notification is attempted. Copy `.env.example` to `.env.local` and supply server-only values. Do not expose any secret using a `NEXT_PUBLIC_` prefix.

1. Create a PostgreSQL database and set `DATABASE_URL`.
2. Run `npx prisma migrate deploy` (or `npx prisma migrate dev` only against a development database).
3. In Resend, verify the `EMAIL_FROM` domain and create an API key. `LEAD_NOTIFICATION_EMAIL` is the internal inbox that receives leads.
4. In Meta Business Manager, configure a WhatsApp Cloud API app and set its callback to `https://YOUR_HOST/api/webhooks/whatsapp`. Use `WHATSAPP_VERIFY_TOKEN` during webhook registration and subscribe to `messages`.
5. Create and approve a template named by `WHATSAPP_NOTIFICATION_TEMPLATE`. Its body must contain four text variables, in order: lead name, contact detail, source, and lead ID. `WHATSAPP_NOTIFICATION_TO` must be an E.164-format internal team number without `+`.

Webhook POSTs are authenticated with Meta's `X-Hub-Signature-256` HMAC using `WHATSAPP_APP_SECRET`. Event IDs and browser idempotency keys prevent duplicate leads. Provider secrets are read only in Node.js route handlers.

No customer message is sent automatically. The outbound WhatsApp adapter sends only the approved internal lead-notification template to `WHATSAPP_NOTIFICATION_TO`.

### Fill a development database

The repository now includes database-backed service and project pages, plus an idempotent starter-content seed. Use these commands only with a local or staging PostgreSQL database—not production.

1. Copy `.env.example` to `.env.local` and set `DATABASE_URL` to your PostgreSQL connection string.
2. Install dependencies and generate the Prisma client:

   ```bash
   npm install
   npx prisma generate
   ```

3. Create the tables in a local development database:

   ```bash
   npx prisma migrate dev
   ```

   For an already provisioned staging database, use `npx prisma migrate deploy` instead. Never run `migrate dev` against production.

4. Add the starter MMS services and projects:

   ```bash
   npm run db:seed
   ```

   The seed uses `upsert`, so it can safely be run again in development without creating duplicate slugs. It creates 6 services and 12 projects. It does not create leads or send email/WhatsApp messages.

5. Review or edit development data with:

   ```bash
   npx prisma studio
   ```

6. Start the app and verify URLs such as `/services/live-streaming-production` and `/projects/global-summit-production`. These slug pages read published records directly from PostgreSQL; an unknown or unpublished slug returns a 404.

To add content manually, create a `Service` or `Project` in Prisma Studio. Keep `slug` lowercase with words separated by hyphens, use image paths from `public` (for example `/mms/DSC_9244.jpg`), set `published` to true, and use `sortOrder` to control future listing order.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
