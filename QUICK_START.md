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

# For local testing, this works. For production, use PostgreSQL:
DATABASE_URL=file:./dev.db

# Get from Cloudinary Dashboard
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dgx0p6axm
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

NODE_ENV=production
```

**Note:** `file:./dev.db` works on Vercel only temporarily. For production, use PostgreSQL (see below).

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

You must switch to PostgreSQL before going live with users.

### Quick PostgreSQL Setup (Free):

1. **Sign up for Neon** (recommended): https://neon.tech
   - Free tier: 10GB storage
   - Serverless PostgreSQL

2. **Create project** → Get connection string:
   ```
   postgresql://username:password@host/database
   ```

3. **Update `prisma/schema.prisma`**:
   ```diff
   - provider = "sqlite"
   + provider = "postgresql"
   ```

4. **Update Vercel Environment Variable**:
   ```
   DATABASE_URL=postgresql://username:password@host/database
   ```

5. **Commit and push** → Vercel will auto-deploy with PostgreSQL

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
