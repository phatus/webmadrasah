# Production Deployment Checklist

## Pre-Deployment Security

### Critical Items (Must Do)
- [x] XSS Protection (DOMPurify installed)
- [x] Strong AUTH_SECRET (64-char random)
- [x] Remove `/api/setup` endpoint
- [x] Rate limiting implemented
- [x] Ownership checks on posts
- [x] Password policy (12+ chars, complexity)
- [x] Security headers configured
- [x] Dependencies audited (0 vulnerabilities)

### Required Configuration

#### 1. Environment Variables (`.env` production)
```env
# Supabase PostgreSQL - REQUIRED for production
# Get connection strings from Supabase Dashboard → Settings → Database
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"

AUTH_SECRET="<generate-64-char-secret>"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

#### 2. Cloudinary Setup
- Create upload preset `webmadrasah_preset` with:
  - unsigned (or signed with API)
  - Max file size: 5MB
  - Allowed formats: jpg, jpeg, png, webp
  - Auto-optimize: enabled
  - Crop: enable

#### 3. Database (Production Requirement)

**PostgreSQL is REQUIRED for production.** SQLite is for development testing only.

- ✅ **Production**: Use Supabase PostgreSQL (or any PostgreSQL provider)
- ❌ **SQLite**: NOT suitable for production - file storage issues on serverless/container environments

Configure Supabase connection strings in `.env` (both `DATABASE_URL` and `DIRECT_URL` needed).

#### 4. Admin User Creation
```bash
# Create admin securely
npx tsx src/scripts/create-admin.ts
# OR manually via database
```

### Security Headers Verified
Check response headers contain:
- `x-frame-options: DENY`
- `x-content-type-options: nosniff`
- `content-security-policy: ...`
- `strict-transport-security` (production only)

### Test Before Launch
- [ ] Test XSS: Try injecting `<script>alert(1)</script>` in post content - should not execute
- [ ] Test rate limit: Submit inquiry 11 times in 15min - should block on 11th
- [ ] Test password: Try "123456" - should reject
- [ ] Test authorization: Log in as EDITOR, try to delete another user's post - should fail
- [ ] Audit logs: Check `/dashboard/audit` shows activities
- [ ] HTTPS: Ensure site served over HTTPS only

### Post-Deployment
- [ ] Remove any debug `console.log` (use environment variable)
- [ ] Enable Vercel/Cloudflare analytics
- [ ] Set up error monitoring (Sentry recommended)
- [ ] Configure backups (daily automated)
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)

---

## Notes

- **Rate Limits**: Currently 10 requests per 15 minutes per email/inquiry
- **Session Duration**: Default NextAuth (30 days for persistent, session only for non-persistent)
- **Audit Logs**: Retained indefinitely (consider archiving old logs > 6 months)
- **File Uploads**: Max 5MB, validated client & server side

---

## Emergency Procedures

### If Compromised:
1. Immediately rotate `AUTH_SECRET`
2. Change all admin passwords
3. Review audit logs at `/dashboard/audit`
4. Check for unauthorized users
5. Restore from backup if needed

### To Revoke All Sessions:
Update all user sessions by changing AUTH_SECRET (forces re-login).
