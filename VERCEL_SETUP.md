# Vercel Environment Variables Setup

## 1. Log in to Vercel

Go to [vercel.com](https://vercel.com) and sign in with your GitHub account.

## 2. Import Project

1. Click **"New Project"**
2. Select your GitHub repository: `phatus/webmadrasah`
3. Click **"Import"**

## 3. Configure Project

- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `.` (default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (auto-detected)

## 4. Add Environment Variables

Click **"Environment Variables"** and add the following:

### Required Variables:

| Name | Value | Type | Description |
|------|-------|------|-------------|
| `DATABASE_URL` | See step 5 below | Secret | Database connection string |
| `AUTH_SECRET` | Generate random 64-char hex | Secret | NextAuth session secret |
| `NODE_ENV` | `production` | Plain | Runtime environment |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `dgx0p6axm` | Plain | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your API key | Secret | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your API secret | Secret | Cloudinary API secret |

### How to Generate AUTH_SECRET:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output (64 characters) and paste as `AUTH_SECRET`.

## 5. Database Setup (IMPORTANT)

### Option A: PostgreSQL (Recommended for Production)

Vercel does NOT persist SQLite files, so you **must** use PostgreSQL in production.

**Free PostgreSQL providers:**

1. **Neon.tech** (Recommended)
   - Sign up at [neon.tech](https://neon.tech)
   - Create new project
   - Copy connection string (e.g., `postgresql://...`)
   - Set `DATABASE_URL` in Vercel

2. **Supabase**
   - Sign up at [supabase.com](https://supabase.com)
   - Create new project
   - Get connection string from Settings → Database
   - Set `DATABASE_URL` in Vercel

3. **Railway**
   - Sign up at [railway.app](https://railway.app)
   - Create PostgreSQL service
   - Copy connection URL

**Connection string format:**
```
postgresql://username:password@host:port/database
```

### Option B: SQLite (Development Only - Not for Vercel)

SQLite file is NOT persistent on Vercel's serverless functions. Use only for local testing.

## 6. Update Prisma Schema for PostgreSQL

If switching from SQLite to PostgreSQL, update `prisma/schema.prisma`:

```diff
-datasource db {
-  provider = "sqlite"
-  url      = env("DATABASE_URL")
-}
+datasource db {
+  provider = "postgresql"
+  url      = env("DATABASE_URL")
+}
```

Then commit and push this change.

## 7. Run Database Migration on Production

After first deployment, run migration on your production database:

```bash
# Option 1: Via Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy

# Option 2: Via SSH into your database host (if self-hosted)
npx prisma migrate deploy

# Option 3: Using Prisma Studio locally with production DATABASE_URL
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

## 8. Create Admin User on Production

After deployment, SSH into production or use Prisma Studio:

```bash
# Using the setup script (modify first!)
npx tsx scripts/setup-production.ts

# Or manually:
npx prisma db seed
# (Make sure prisma.seed is configured in package.json)
```

## 9. Deploy

Click **"Deploy"** button in Vercel.

Wait for build to complete (2-5 minutes).

## 10. Verify Deployment

1. Open deployment URL
2. Login to `/login` with admin credentials
3. Check that everything works:
   - Dashboard loads
   - Can create posts
   - Settings configurable
   - Forms submit correctly

## 11. Add Custom Domain (Optional)

1. Go to project → **Settings** → **Domains**
2. Add your domain (e.g., `mtsn1pacitan.sch.id`)
3. Update DNS at your domain registrar:
   - Add `CNAME` record pointing to `cname.vercel-dns.com`
   - Or add `A` records as shown in Vercel

Wait 5-30 minutes for DNS propagation.

## 12. Enable Automatic Deployments

Vercel automatically:
- Deploys on every push to `main`
- Creates preview deployments for PRs
- Rollbacks available in Deployments tab

## 13. Monitor

- **Logs**: Project → Logs tab
- **Analytics**: Project → Analytics tab
- **Errors**: Set up Sentry or similar

## Environment Variables Summary

| Variable | Where to get it | Required? |
|----------|----------------|-----------|
| `DATABASE_URL` | Neon/Supabase/Railway | ✅ **Yes** |
| `AUTH_SECRET` | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` | ✅ **Yes** |
| `NODE_ENV` | Set to `production` | ✅ **Yes** |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary Dashboard | ✅ **Yes** |
| `CLOUDINARY_API_KEY` | Cloudinary Dashboard → Account details | ✅ **Yes** |
| `CLOUDINARY_API_SECRET` | Cloudinary Dashboard → Account details | ✅ **Yes** |

## Troubleshooting

### Build fails with "Prisma schema validation error"
- Make sure `prisma generate` ran successfully
- Check `DATABASE_URL` format matches provider

### Database connection error
- Verify `DATABASE_URL` is correct
- For PostgreSQL, ensure Vercel IPs are whitelisted (if using IP allowlist)
- Check database is running and accessible

### Auth not working
- Verify `AUTH_SECRET` is at least 32 characters
- Clear browser cookies
- Check Vercel logs for errors

### Images not uploading
- Verify Cloudinary credentials
- Create upload preset `webmadrasah_preset`
- Check Cloudinary plan limits

---

Need help? Check:
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
- [Prisma with Vercel](https://prisma.io/docs/guides/deployment/vercel)
