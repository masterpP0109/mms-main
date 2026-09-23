# MMS Project: Simple Start and Database Guide

This guide explains how to start the MMS website and put starter information into its database. It is written for someone who is new to coding.

## 1. Think of the project like a school

- The **website** is the classroom people can see.
- The **backend** is the teacher doing work behind the scenes.
- PostgreSQL is the **filing cabinet** where information is saved.
- Prisma is the **helper** that reads and writes information in the filing cabinet.
- A migration builds the correct drawers inside the filing cabinet.
- A seed puts starter information into those drawers.

The website and backend are together in this Next.js project. There is no separate `backend` folder required to start it.

## 2. Programs you need

Install these programs before continuing:

1. **Node.js 20 or newer**
2. **PostgreSQL**
3. **Visual Studio Code**
4. **Git**

You can check Node.js by opening a terminal and running:

```powershell
node --version
```

You can check npm with:

```powershell
npm --version
```

If both commands show version numbers, they are installed.

## 3. Open the correct folder

Open this folder in Visual Studio Code:

```text
C:\Users\user\Desktop\mms-main
```

Open a terminal in Visual Studio Code by selecting **Terminal → New Terminal**.

Make sure the terminal is inside the project folder:

```powershell
cd C:\Users\user\Desktop\mms-main
```

## 4. Install the project packages

Packages are reusable pieces of code needed by the project. Install them with:

```powershell
npm install
```

Wait for the command to finish. You normally only need to run it after downloading the project or when `package.json` changes.

## 5. Create a PostgreSQL database

Open pgAdmin or another PostgreSQL tool and create an empty database named:

```text
mms
```

You need to know these four values:

- PostgreSQL username, often `postgres`
- PostgreSQL password
- Host, usually `localhost`
- Port, usually `5432`

A local connection normally looks like this:

```text
postgresql://postgres:YOUR_PASSWORD@localhost:5432/mms?schema=public
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

Do not share this connection string publicly because it contains your password.

## 6. Create the environment file

The environment file holds private settings. Create it by running:

```powershell
Copy-Item .env.example .env.local
```

Open `.env.local` and change `DATABASE_URL`:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/mms?schema=public"
```

Keep `.env.local` private. Never commit it to Git and never put passwords in `.env.example`.

The email and WhatsApp values can stay as development placeholders until you are ready to test those providers. Do not use real credentials in screenshots or documentation.

## 7. Generate the Prisma helper

Run:

```powershell
npx prisma generate
```

This teaches Prisma about the tables described in `prisma/schema.prisma`.

## 8. Apply the database migrations

Run this only against your local development database:

```powershell
npx prisma migrate dev
```

This creates the tables for:

- leads from website forms;
- processed webhook events;
- services;
- projects.

If Prisma asks for a migration name, enter something simple such as:

```text
setup_database
```

Do not use `prisma migrate dev` on a production database. A deployed staging or production environment should use:

```powershell
npx prisma migrate deploy
```

## 9. Seed the database

Seeding means adding starter content automatically. Run:

```powershell
npm run db:seed
```

The seed adds:

- 6 MMS services;
- 12 MMS projects.

It does not create fake customer leads, and it does not send emails or WhatsApp messages.

The seed uses `upsert`. That means running it again updates matching records instead of creating copies with the same slug.

## 10. Look inside the database

Run:

```powershell
npx prisma studio
```

Prisma Studio opens in your browser. It works like a simple spreadsheet for the database.

You can open `Service` or `Project`, select a record, edit it, and save it.

Important content rules:

- A slug should use lowercase words and hyphens, for example `live-streaming-production`.
- Do not put spaces in a slug.
- Image paths should point into the `public` folder, for example `/mms/DSC_9244.jpg`.
- Set `published` to `true` when the page should be visible.
- An unpublished or unknown slug shows a 404 page.

Stop Prisma Studio with `Ctrl + C` in its terminal.

## 11. Start the website

Run:

```powershell
npm run dev
```

Open this address in your browser:

```text
http://localhost:3000
```

Try these database-backed pages:

```text
http://localhost:3000/services/live-streaming-production
http://localhost:3000/services/led-screen-rental
http://localhost:3000/projects/global-summit-production
http://localhost:3000/projects/destination-wedding-in-victoria-falls
```

Stop the website by pressing `Ctrl + C` in the terminal.

## 12. Your normal daily routine

You do not need to migrate and seed every day. A normal workday is:

```powershell
cd C:\Users\user\Desktop\mms-main
npm run dev
```

Only run migrations when the Prisma schema or migration files have changed. Only rerun the seed when you want to restore or update the starter content.

## 13. Check that the project is healthy

Run these commands before sharing your work:

```powershell
npm run lint
npx tsc --noEmit
npm test -- --runInBand
npm run build
```

What they mean:

- `lint` finds common code mistakes.
- `tsc` checks TypeScript types.
- `test` checks expected behavior.
- `build` makes sure the production version can be created.

The build needs internet access the first time because the project downloads Google Fonts.

## 14. Common problems

### “Can't reach database server”

PostgreSQL may not be running, or the host and port in `DATABASE_URL` may be wrong. Start PostgreSQL and check that the usual port is `5432`.

### “Authentication failed”

The PostgreSQL username or password in `DATABASE_URL` is wrong. Correct it in `.env.local`.

### “Database does not exist”

Create the `mms` database in pgAdmin, or change the database name in `DATABASE_URL` to one that already exists.

### A service or project page shows 404

Check the following in Prisma Studio:

1. The record exists.
2. Its slug matches the address exactly.
3. `published` is set to `true`.

### `npm run db:seed` says a table does not exist

Apply the migrations first:

```powershell
npx prisma migrate dev
npm run db:seed
```

### Port 3000 is already being used

Another website may already be running. Stop it with `Ctrl + C`, or accept the different port suggested by Next.js.

## 15. The full first-time command list

For quick reference, the first setup is:

```powershell
cd C:\Users\user\Desktop\mms-main
npm install
Copy-Item .env.example .env.local
# Edit DATABASE_URL in .env.local before continuing.
npx prisma generate
npx prisma migrate dev
npm run db:seed
npm run dev
```

After that, open `http://localhost:3000`.

