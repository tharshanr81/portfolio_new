# Tharshan's Portfolio

A personal portfolio and lightweight admin dashboard built with Next.js 14, React, TypeScript, Tailwind CSS, Prisma, and SQLite.

## Features

- Public portfolio pages for profile, projects, skills, education, experience, and certificates
- Admin dashboard for managing portfolio content
- Admin login with HTTP-only session cookies
- Contact form with messages stored in the database
- Upload support for portfolio images, certificates, avatar, and resume

## Requirements

- Node.js 18.17 or newer
- npm

## Local setup

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Create your local environment file:

   ```bash
   cp .env.example .env
   ```

   On Windows PowerShell, use:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Edit `.env` and set:
   - `DATABASE_URL`
   - `JWT_SECRET` (a unique random value with at least 32 characters)
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD` (at least 12 characters)
   - `NEXT_PUBLIC_SITE_URL`

   Never commit `.env` or share its values.

4. Generate Prisma Client and create the local database:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Create the initial admin account and populate the portfolio:

   ```bash
   npm run db:seed
   ```

   **Important:** The seed script resets portfolio content collections before inserting its sample content. Back up your database before running it again if you have made changes through the admin dashboard.

6. Start the development server:

   ```bash
   npm run dev
   ```

   Open `http://localhost:3000`. The admin dashboard is at `http://localhost:3000/admin`.

## Production build

```bash
npm run build
npm start
```

## Database and deployment notes

This repository uses SQLite for local development. The local database file is intentionally excluded from GitHub because it can contain private contact messages and admin account data.

For public deployment, choose a host that supports the Next.js server runtime, persistent database storage, and persistent file uploads. A serverless/static-only host is not automatically compatible with this SQLite and local-file-upload setup. If you use a hosted database, update the Prisma datasource and `DATABASE_URL` to match that provider before deploying.

Uploaded files are stored under `public/uploads` by the current implementation. On hosting platforms with ephemeral filesystems, uploaded files may disappear after redeployments. Use persistent storage or an object-storage service if your chosen host does not provide persistent disk storage.

## GitHub safety

- `.env` and local database files are ignored by Git.
- Never commit passwords, JWT secrets, or private contact-message data.
- Change the admin password and JWT secret before deploying.
- Keep admin credentials private.
