# BurgerMasters

Live: [https://burgermasters.vercel.app](https://burgermasters.vercel.app)

Next.js App Router rebuild of Stiliyan Nikolov's BurgerMasters shop. Public menu with original burger images and BGN prices, plus a hashed-password admin kitchen.

Original sources:

- Front-end images: [BurgerMasters-Front-end](https://github.com/Stiliyan26/BurgerMasters-Front-end)
- Seed names / prices / descriptions: [MenuItemConfiguration.cs](https://github.com/Stiliyan26/BurgerMasters-Back-end/blob/main/BurgerMasters/BurgerMasters.Infrastructure/Data/Configuration/MenuItemConfiguration.cs)

The duplicate `Burger Pie` seed row is skipped. Fries and drinks from the same file are included.

## Stack

- Next.js App Router on Vercel
- Prisma + Neon Postgres
- Cookie session for admin (`jose` JWT + `bcryptjs`)

## Local setup

```bash
cp .env.example .env
# fill DATABASE_URL, DATABASE_URL_UNPOOLED, SESSION_SECRET, ADMIN_PASSWORD
npm install
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin is at `/login` then `/admin`.

## Neon

Preferred: after `vercel link`, provision Neon from the Vercel Marketplace:

```bash
vercel integration add neon --yes
vercel env pull .env.local --yes
```

If Marketplace needs a browser claim, finish that in the Vercel dashboard, then pull env vars again.

Fallback with Neon CLI:

```bash
npx neonctl auth
npx neonctl projects create --name burgermasters
npx neonctl connection-string --project-id <id>
```

Put the pooled URL in `DATABASE_URL` and the direct URL in `DIRECT_URL`.

## Vercel deploy

```bash
vercel link --yes
# Neon Marketplace already injects DATABASE_URL + DATABASE_URL_UNPOOLED
echo "$SESSION_SECRET" | vercel env add SESSION_SECRET production preview development
vercel --prod --yes
npx dotenv -e .env -- npx prisma migrate deploy
npx dotenv -e .env -- npx prisma db seed
```

`postinstall` runs `prisma generate`. Production build does not auto-seed.

## Admin

Default seed user is `admin` unless `ADMIN_USERNAME` / `ADMIN_PASSWORD` are set. Credentials live in the vault file `02. Personal/Accounts.md`.
