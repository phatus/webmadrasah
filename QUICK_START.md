# 🚀 QUICK START - Deploy in 10 Minutes

## ✅ Done! Your code is ready for automatic deployment.

### 📍 Current Status:
- ✅ GitHub repository: https://github.com/phatus/webmadrasah
- ✅ CI/CD workflow configured
- ✅ Security hardening complete
- ✅ All code committed to `main` branch

---

## 🎯 Next Steps: Deploy to Vercel (5 minutes)

### Step 1: Go to Vercel
https://vercel.com/new

### Step 2: Import Repository
1. Sign in with GitHub
2. Select repository: `phatus/webmadrasah`
3. Click **Import**

### Step 3: Configure
- **Framework**: Next.js (auto-selected)
- **Root Directory**: `.`
- Leave other defaults

### Step 4: Add Environment Variables

**CRITICAL: Add these in Vercel Dashboard → Environment Variables**

```env
# Generate this! Run in terminal:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
AUTH_SECRET=your-generated-64-char-secret-here

# ⚠️ PRODUCTION REQUIRED: Use PostgreSQL (Supabase).
# SQLite (file:./dev.db) does NOT persist on Vercel serverless.
# Get from Supabase: Settings → Database → Connection String
DATABASE_URL=postgresql://username:password@host/database

# Get from Cloudinary Dashboard
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dgx0p6axm
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

NODE_ENV=production
```

**⚠️ CRITICAL:** SQLite (`file:./dev.db`) will NOT work on Vercel production. You **must** use PostgreSQL. See "Database for Production" section below.

### Step 5: Deploy
Click **"Deploy"** button.

Wait 2-5 minutes.

### Step 6: Verify
Open your deployed URL (e.g., `https://webmadrasah.vercel.app`)

1. Go to `/login`
2. Login with:
   - Username: `admin`
   - Password: `password123` (change immediately!)
3. Check dashboard works
4. Test creating a post

---

## 🔄 Automatic Deployments

After initial setup:
- ✅ Push to `main` → auto deploy
- ✅ Pull requests → preview deployments
- ✅ Every commit → builds and deploys

---

## ⚠️ Important: Database for Production

**SQLite does NOT work on Vercel for production.**

You must use Supabase PostgreSQL (recommended) or any PostgreSQL provider before going live.

### Quick Setup with Supabase (Recommended - Free Tier):

1. **Sign up for Supabase**: https://supabase.com
   - Free tier: 500MB database, generous limits
   - Built-in PostgreSQL with connection pooling

2. **Create new project**:
   - Choose a name and region (select closest to your users)
   - Wait for provisioning (1-2 minutes)

3. **Get connection strings**:
   - Go to **Settings** → **Database** → **Connection String**
   - Copy **"Connection pooling"** string (for `DATABASE_URL`)
   - Copy **"Direct connection"** string (for `DIRECT_URL`)
   - Connection format:
     ```
     postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
     ```

4. **Update both `.env` and Vercel environment variables**:
   ```env
   DATABASE_URL="postgresql://postgres.pwkjffuaeughbzqvpala:your-password@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.pwkjffuaeughbzqvpala:your-password@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
   ```

5. **Update `prisma/schema.prisma`** (if not already):
   ```diff
   - datasource db {
   -   provider = "sqlite"
   -   url      = env("DATABASE_URL")
   - }
   + datasource db {
   +   provider = "postgresql"
   +   url      = env("DATABASE_URL")
   + }
   ```

6. **Whitelist Vercel IPs in Supabase** (optional but recommended):
   - Supabase Dashboard → Settings → Database → Network
   - Add Vercel IP ranges or enable "Allow all requests" for simplicity

7. **Commit and push** → Vercel will auto-deploy with PostgreSQL

### Alternative PostgreSQL Providers:

- **Neon.tech**: Serverless PostgreSQL, free 10GB
- **Railway**: Easy PostgreSQL service
- **AWS RDS / DigitalOcean Managed Database**: For production scale

### Important: Update Prisma Schema for PostgreSQL

```bash
# After updating prisma/schema.prisma provider to "postgresql"
npx prisma generate
git add prisma/schema.prisma
git commit -m "chore: switch to PostgreSQL for production"
git push
```

Vercel will auto-deploy with new database configuration.

---

## 📚 Documentation Files Created

| File | Purpose |
|------|---------|
| `DEPLOYMENT.md` | General deployment checklist |
| `VERCEL_SETUP.md` | Detailed Vercel setup guide |
| `PRD.md` | Product requirements (if exists) |
| `README.md` | Project overview (update this!) |
| `.github/workflows/ci.yml` | CI pipeline |
| `.github/workflows/deploy.yml` | CD pipeline |
| `scripts/setup-dev.ts` | Local dev setup |
| `scripts/setup-production.ts` | Production setup |

---

## 🔧 Useful Commands

```bash
# Development
npm run dev              # Start dev server on :3001
npm run setup:dev        # Setup local database

# Build
npm run build            # Build for production
npm start                # Start production server

# Database
npx prisma studio        # Open database GUI
npx prisma generate      # Regenerate Prisma client
npx prisma db push       # Push schema changes

# Production setup
npm run setup:prod       # Run on production server
```

---

## 🆘 Need Help?

1. **Build fails?** Check Vercel logs → Project → Logs
2. **Database error?** Verify `DATABASE_URL` format
3. **Auth not working?** Check `AUTH_SECRET` is 64+ chars
4. **Images not loading?** Check Cloudinary credentials

---

## 🎉 You're Done!

Your app will automatically deploy on every push to `main`.

**Deployment URL** (after Vercel setup): `https://webmadrasah.vercel.app`

**Admin login:**
- Username: `admin`
- Password: `password123` (change after first login!)

---

**Happy Deploying! 🚀**
