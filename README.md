# Web Madrasah - Next.js School Website

A modern, full-stack school website built with Next.js 14, Prisma ORM, Supabase PostgreSQL, NextAuth.js, and Cloudinary.

## Features

- **Authentication**: NextAuth.js with secure session management
- **Database**: Supabase PostgreSQL with Prisma ORM
- **Image Management**: Cloudinary for optimized image uploads and delivery
- **Admin Dashboard**: Manage teachers, posts, pages, settings, and more
- **Public Pages**: Profil Guru, Berita, Prestasi, Ekstrakurikuler, Gallery, Agenda, Download, Pengumuman
- **SEO Optimized**: Meta tags, Open Graph, structured data
- **Security**: Rate limiting, XSS protection, comprehensive Auth checks
- **Audit Logging**: Track all admin activities
- **Responsive Design**: Mobile-first Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Images**: Cloudinary
- **Validation**: Zod
- **Deployment**: Vercel / aaPanel (Node.js)

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Supabase account (free tier)
- Cloudinary account (free tier)

### Local Development Setup

1. **Clone repository**
   ```bash
   git clone https://github.com/phatus/webmadrasah.git
   cd webmadrasah
   ```

2. **Install dependencies**
   ```bash
   npm ci
   ```

3. **Set up environment variables**
   Create `.env` file from example:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Supabase and Cloudinary credentials.

   Required variables:
   ```env
   DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
   AUTH_SECRET="generate-with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
   NEXTAUTH_SECRET="same-as-AUTH_SECRET"
   NEXTAUTH_URL="http://localhost:3001"
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```

4. **Set up database**
   ```bash
   npx prisma generate
   npx prisma db push        # For development
   # OR
   npx prisma migrate dev    # If using migrations
   ```

5. **Seed initial data** (optional)
   ```bash
   npx tsx src/scripts/seed.ts
   ```

6. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3001](http://localhost:3001)

7. **Create admin user**
   ```bash
   npx tsx src/scripts/create-admin.ts
   ```
   Default admin: username `admin`, password `password123` (change immediately!)

## Database Schema

The application uses Prisma with the following main models:

- **User**: Authentication and role management (ADMIN, EDITOR)
- **Teacher**: Guru data with name, subject, position, image
- **Post**: Berita/articles with categories, author, slug
- **Category**: Post categories
- **Student** (Alumni): Alumni records
- **Competition**: Pelajaran/pembinaan events
- **Achievement**: Prestasi with category, level, rank
- **Extracurricular**: Ekstrakurikuler
- **Agenda**: Kegiatan/acara calendar
- **Download**: Berkas/downloadable files
- **Gallery**: Foto gallery with cover image
- **Inquiry**: Contact form submissions
- **AppSetting**: Global site settings
- **FeaturedProgram**: Program unggulan
- **AuditLog**: Activity tracking

## Deployment

### Production Database: PostgreSQL Required

**SQLite is development-only.** For production, use Supabase PostgreSQL or any PostgreSQL provider.

#### Deploy to Vercel

See [QUICK_START.md](./QUICK_START.md) for step-by-step Vercel deployment guide.

#### Deploy to aaPanel (VPS)

See [DEPLOY_AAPANEL.md](./DEPLOY_AAPANEL.md) for detailed aaPanel deployment with Supabase.

## Project Structure

```
webmadrasah/
├── app/                    # Next.js 14 App Router
│   ├── (admin)/           # Admin dashboard routes
│   ├── (public)/          # Public pages
│   └── api/               # API routes
├── components/            # Reusable React components
├── lib/                   # Utilities (db, auth, audit, etc.)
├── prisma/                # Database schema & migrations
├── public/                # Static assets
├── scripts/               # Dev/Admin scripts
├── src/actions/           # Server Actions (CRUD operations)
│   ├── teacher.ts
│   ├── post.ts
│   ├── category.ts
│   ├── academic.ts
│   ├── alumni.ts
│   ├── competition.ts
│   ├── user.ts
│   ├── settings.ts
│   ├── inquiry.ts
│   ├── extracurricular.ts
│   ├── achievement.ts
│   └── featured-program.ts
└── .env.example           # Environment variables template
```

## Key Features Implementation

### Case-Insensitive Search

Search functionality uses Prisma's `mode: 'insensitive'` to provide SQLite-like case-insensitive behavior in PostgreSQL:

```typescript
where: {
  OR: [
    { name: { contains: query, mode: 'insensitive' } },
    { subject: { contains: query, mode: 'insensitive' } },
  ]
}
```

### Error Handling

All server actions have comprehensive try-catch blocks to prevent 502 errors and provide graceful fallbacks.

### Caching

Uses Next.js `unstable_cache` for data fetching where appropriate to improve performance.

### Security

- Rate limiting on public forms (inquiry, alumni registration)
- XSS protection with DOMPurify
- Strong password policy (12+ chars, complexity)
- Session timeout and secure cookies
- Audit logging for admin actions
- Ownership checks on data modifications

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at :3001 |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npx prisma studio` | Open database GUI |
| `npx prisma generate` | Regenerate Prisma client |
| `npx prisma db push` | Push schema to database |
| `npx prisma migrate dev` | Create & apply migration |
| `npx prisma migrate deploy` | Apply migrations to production |
| `npx prisma migrate reset` | Reset database (dev only) |
| `npx tsx src/scripts/create-admin.ts` | Create admin user |
| `npx tsx src/scripts/seed.ts` | Seed initial data |

## Environment Variables

See `.env.example` for full list of required variables.

**Critical for production:**
- `DATABASE_URL` (PostgreSQL connection)
- `DIRECT_URL` (for migrations)
- `AUTH_SECRET` (64-char random)
- `NEXT_PUBLIC_CLOINARY_*` (Cloudinary credentials)

## Testing

- **Local**: `npm run dev` at http://localhost:3001
- **Type check**: `npx tsc --noEmit`
- **Build verification**: `npm run build`
- **Lint**: `npm run lint` (if configured)

## Troubleshooting

### Database connection error
- Verify `DATABASE_URL` and `DIRECT_URL` are correct
- Check server IP whitelisted in Supabase (Settings → Database → Network)
- Ensure `prisma/schema.prisma` provider is `postgresql`

### 502 Bad Gateway after deploy
- Check Node.js process is running
- View logs: `pm2 logs webmadrasah` (VPS) or Vercel dashboard
- Ensure `.env` present in production with correct values

### Images not loading
- Verify Cloudinary credentials
- Check upload preset `webmadrasah_preset` exists in Cloudinary

### Search not working case-insensitively
- Ensure code updated with `mode: 'insensitive'`
- Database must be PostgreSQL (SQLite already case-insensitive)
- Clear browser cache

## Documentation

- [Quick Start - Vercel](./QUICK_START.md)
- [Deploy to aaPanel](./DEPLOY_AAPANEL.md)
- [General Deployment Guide](./DEPLOYMENT.md)
- [Vercel Setup Details](./VERCEL_SETUP.md)

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## License

[ISC](https://choosealicense.com/licenses/isc/)

---

**Built with ❤️ for educational institutions**
