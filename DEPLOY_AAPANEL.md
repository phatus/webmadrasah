# Panduan Deploy ke aaPanel dengan Supabase PostgreSQL

Panduan ini berisi langkah-langkah untuk mendeploy aplikasi Next.js Web Madrasah ke aaPanel menggunakan Node.js Manager dengan Supabase sebagai database PostgreSQL.

## Prasyarat
1. **aaPanel** terinstal di server.
2. **Node.js Manager** (versi 2.0 atau terbaru) terinstal di aaPanel (install via App Store).
3. **Git** terinstal di server.
4. **Supabase project** sudah dibuat dan database sudah ready.

## Langkah 1: Persiapan di aaPanel

1. Login ke aaPanel.
2. Buka **Files** dan masuk ke direktori `/www/wwwroot/`.
3. Buka Terminal (bisa via SSH atau terminal bawaan aaPanel).

## Langkah 2: Clone Repository

Jalankan perintah berikut di terminal server:

```bash
cd /www/wwwroot/
git clone https://github.com/phatus/webmadrasah.git
cd webmadrasah
```

## Langkah 2.5: Konfigurasi .env (PENTING)

**IMPORTANT**: Database akan menggunakan Supabase PostgreSQL, bukan SQLite.

Buat file `.env` di dalam folder `webmadrasah`:

1. Buka File Manager aaPanel.
2. Masuk ke `/www/wwwroot/webmadrasah`.
3. Buat file baru bernama `.env`.
4. Isi dengan konten berikut (ganti dengan Supabase connection strings Anda):

```env
# Supabase PostgreSQL Connection Strings
# Get from Supabase Dashboard → Your Project → Settings → Database → Connection String
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"

# Generate this! Run in terminal (64-char random hex):
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
AUTH_SECRET="your-generated-64-char-secret-here"

# Cloudinary (from your Cloudinary Dashboard)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dgx0p6axm"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
```

### Catatan penting tentang Supabase:
- `DATABASE_URL`: Connection string dengan connection pool (port 6543, `?pgbouncer=true`)
- `DIRECT_URL`: Direct connection tanpa pooling (port 5432) - **diperlukan untuk migrations**
- Ganti `[PROJECT-REF]` dengan reference ID project Supabase Anda (e.g., `pwkjffuaeughbzqvpala`)
- Ganti `[PASSWORD]` dengan password database Supabase Anda
- Anda bisa menemukan kedua connection string ini di Supabase Dashboard → Settings → Database → Connection String → "Connection pooling" dan "Direct connection"

## Langkah 3: Whitelist Server IP di Supabase (CRITICAL!)

**Sebelum melanjutkan, Anda harus whitelist server IP di Supabase:**

1. Dapatkan IP address server aaPanel Anda:
   ```bash
   curl ifconfig.me
   ```
   Atau cek di aaPanel → Network → IP Address.

2. Buka [Supabase Dashboard](https://supabase.com) → Your Project → **Settings** → **Database** → **Network**

3. Di bagian **IP Allow List**, tambahkan IP server Anda:
   - Untuk production: tambahkan IP server spesifik (recommended)
   - Untuk testing: Anda bisa tambahkan `0.0.0.0/0` (allow all) tapi **kurangi setelah production**

4. Klik **Save** atau **Add IP Address**.

**Jika tidak melakukan ini, koneksi database akan gagal dan app tidak bisa start.**

## Langkah 4: Install & Build

Masih di terminal dalam folder `webmadrasah`, jalankan:

```bash
# Install dependencies
npm ci

# Generate Prisma Client (PENTING: Agar mengenali database PostgreSQL)
npx prisma generate

# Run migrations to set up database schema
npx prisma migrate deploy

# Build aplikasi untuk production
npm run build
```

> **Catatan**: Jika build gagal karena memory, pastikan server memiliki RAM cukup (minimal 1GB) atau aktifkan SWAP di aaPanel.

### Troubleshooting build errors:

**Error: "Schema validation error" atau "P3001"**:
- Pastikan `DATABASE_URL` dan `DIRECT_URL` sudah di-set dengan benar di `.env`
- Pastikan server IP sudah di-whitelist di Supabase
- Test connection: `npx prisma db pull` (harus berhasil connect)

**Error: "-permission denied for schema public"**:
- Di Supabase Dashboard → Authentication → Policies, pastikan Row Level Security (RLS) di-set dengan benar untuk tabel yang diperlukan, atau matikan RLS untuk development.

## Langkah 5: Setup Node Project di aaPanel

1. Buka menu **Website** → **Node Project** di aaPanel.
2. Klik **Add Node Project**.
3. Isi konfigurasi:
   - **Project Path**: Pilih folder `/www/wwwroot/webmadrasah`.
   - **Name**: `webmadrasah` (otomatis terisi).
   - **Run User**: `www`.
   - **Start Command**: `npm start` (atau script `start` di package.json).
   - **Port**: `3000`.
   - **Node Version**: Pilih versi v18 atau yang lebih baru.
4. Klik **Submit**.

> **Info**: Kami telah mengaktifkan `output: 'standalone'` di konfigurasi Next.js. Namun, untuk kemudahan di aaPanel, menggunakan `npm start` (yang menjalankan `next start`) adalah cara paling aman.

## Langkah 6: Domain & SSL (Mapping)

1. Di daftar Node Project, klik **Domain** (atau Mapping).
2. Masukkan domain Anda (contoh: `mtsn1pacitan.sch.id`).
3. Setelah domain aktif, masuk ke tab **SSL**.
4. Pilih **Let's Encrypt**, centang domain, dan klik **Apply**.
5. Aktifkan "Force HTTPS" jika perlu.

## Langkah 7: Create Admin User

Setelah deployment, buat admin user:

```bash
# Jalankan di terminal di folder webmadrasah
npx tsx src/scripts/create-admin.ts
```

Atau manually via database:
```bash
npx prisma db seed
```
(Make sure seed script configured in package.json)

Default admin login:
- Username: `admin`
- Password: `password123` (change immediately!)

## Cara Update Aplikasi

Jika Anda melakukan perubahan code dan push ke GitHub, lakukan ini di server untuk update:

1. Buka Terminal dan masuk ke folder:
   ```bash
   cd /www/wwwroot/webmadrasah
   ```
2. Tarik update terbaru:
   ```bash
   git pull
   ```
3. Install dependencies dan build ulang:
   ```bash
   npm ci
   npx prisma generate
   npx prisma migrate deploy
   npm run build
   ```
4. **Restart** project di menu Node Project aaPanel untuk menerapkan perubahan.

### Alternative: Using PM2 directly (if configured)

```bash
cd /www/wwwroot/webmadrasah
git pull
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 restart webmadrasah
pm2 logs webmadrasah --lines 50  # Check for errors
```

## Monitoring & Debugging

### Check logs di aaPanel:
1. Buka **Website** → **Node Project** → `webmadrasah`
2. Klik **Log** untuk melihat real-time logs
3. Atau akses via terminal: `pm2 logs webmadrasah`

### Check database connection:
```bash
npx prisma migrate status
```
Harus menampilkan:
```
✅  Database connections created

Migration name        Applied at
...
No pending migrations
```

### Test API endpoints:
```bash
curl -I https://mtsn1pacitan.sch.id/profil/guru  # Should return 200
curl -I https://mtsn1pacitan.sch.id/berita       # Should return 200
```

## Troubleshooting

### Database connection fails
- **Check**: `.env` memiliki `DATABASE_URL` dan `DIRECT_URL` yang benar
- **Check**: Server IP sudah di-whitelist di Supabase (Settings → Database → Network)
- **Check**: Format connection string sesuai provider Supabase (biasanya `aws-0-ap-south-1.pooler.supabase.com`)
- Test dengan: `npx prisma db pull` – jika berhasil, koneksi OK

### 502 Bad Gateway after deploy
- **Check**: Node.js project running di aaPanel (status "Running")
- **Check**: Port 3001 tidak digunakan aplikasi lain (sesuaikan dengan port di package.json)
- **Check**: `npm run build` berhasil tanpa error
- **Check**: Logs via `pm2 logs webmadrasah` untuk error spesifik

### 404 Not Found pada Sub-halaman (Routing Error)
Jika halaman utama (`/`) bisa dibuka tapi halaman lain (`/profil`, `/berita`, dll) memberikan error 404:
- **Penyebab**: Nginx mencoba mencari file fisik di server bukannya meneruskan request ke Next.js.
- **Solusi**: 
  1. Buka aaPanel → **Website** → Klik Domain → **Config**.
  2. Cari bagian `location /` dan pastikan ada `proxy_pass`.
  3. **Hapus atau comment** baris `try_files $uri $uri/ =404;` jika ada.
  4. Pastikan port di `proxy_pass` adalah `http://127.0.0.1:3001`.
  5. Simpan dan restart Nginx.

### Build fails với memory error
- Server RAM kurang (< 1GB): aktifkan SWAP di aaPanel (Settings → Swap)
- Atau increase swap size via command line:
  ```bash
  dd if=/dev/zero of=/swapfile bs=1024 count=2097152  # 2GB
  mkswap /swapfile
  swapon /swapfile
  ```

### Images not loading
- Pastikan Cloudinary credentials benar di `.env`
- Pastikan upload preset `webmadrasah_preset` sudah dibuat di Cloudinary
- Upload preset harus **unsigned** atau signed dengan API key yang sama

### Search tidak case-insensitive
- Pastikan kode sudah di-update dengan `mode: 'insensitive'` pada queries
- Schema database harus PostgreSQL (bukan SQLite)
- Clear browser cache (Ctrl+F5) setelah deploy

## Important Notes

✅ **Database**: Gunakan Supabase PostgreSQL untuk production. SQLite **tidak** disarankan untuk production server.

✅ **Migrations**: Selalu jalankan `npx prisma migrate deploy` setelah `git pull` jika ada schema changes.

✅ **Environment**: Pastikan `.env` berada di root project (`/www/wwwroot/webmadrasah/.env`).

✅ **Security**:
- Ganti password default admin (`password123`) segera setelah login pertama
- Gunakan strong `AUTH_SECRET` (64+ chars random)
- Enable HTTPS dengan Let's Encrypt (sudah di步骤 6)

✅ **Backup**: Gunakan Supabase automatic backups atau setup manual backup via Supabase Dashboard.

## Performance Tips

1. **Enable caching**: `npx prisma generate` membuat client高效, gunakan caching di Next.js (ternaga `unstable_cache` sudah diimplementasi).
2. **Database indexing**: Supabase otomatis index primary keys. Untuk frontend search, pertimbangkan menambah trigram index:
   ```sql
   CREATE EXTENSION IF NOT EXISTS pg_trgm;
   CREATE INDEX teacher_name_idx ON teacher USING gin (name gin_trgm_ops);
   ```
3. **Image optimization**: Cloudinary handle optimization. Gunakan `width`, `height`, dan `quality` parameters.

## Emergency Procedures

### Database connection lost:
1. Check Supabase status: [status.supabase.com](https://status.supabase.com)
2. Verify server IP masih di-whitelist
3. Restart Node.js project di aaPanel

### Need to reset database:
```bash
# Reset all data (development only!)
npx prisma migrate reset
#akan minta konfirmasi, hati-hati!
```

### Rollback deployment:
```bash
# Via Git
git log --oneline  # Find commit to rollback
git checkout <commit-hash>
npm ci && npm run build
# Restart Node project

# Atau via aaPanel: replace code dengan backup sebelumnya
```

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/app/building-your-application/deploying
- **aaPanel Docs**: https://www.aapanel.com/docs/

---

**Deployment selesai!** Aplikasi bisa diakses di: `https://mtsn1pacitan.sch.id`
