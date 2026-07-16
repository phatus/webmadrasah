# Panduan Migrasi Database dari Supabase ke PostgreSQL Lokal Server

Panduan ini menjelaskan langkah demi langkah untuk memindahkan database proyek **Web Madrasah** dari Supabase (Cloud) ke database PostgreSQL lokal yang terinstal di server VPS/aaPanel Anda.

---

## Langkah 1: Pasang & Siapkan PostgreSQL di Server VPS (aaPanel)

Anda perlu memastikan server Anda memiliki server PostgreSQL yang berjalan. Ada dua cara utama:

### Opsi A: Menggunakan aaPanel App Store (Sangat Direkomendasikan)
1. Masuk ke **aaPanel Dashboard**.
2. Buka menu **App Store** di sebelah kiri.
3. Cari **"PostgreSQL Manager"**, lalu klik **Install**.
4. Setelah terpasang, buka PostgreSQL Manager.
5. Buat database baru:
   - **Database Name:** `webmadrasah`
   - **Username:** `madrasah_user`
   - **Password:** `ganti_dengan_password_aman_anda`
6. Pastikan status PostgreSQL dalam kondisi **Running**.

### Opsi B: Menggunakan Command Line (Terminal SSH)
Jika tidak menggunakan PostgreSQL Manager dari aaPanel, Anda bisa memasangnya secara manual melalui terminal SSH:
1. Hubungkan ke server Anda menggunakan SSH.
2. Pasang PostgreSQL (misal pada Ubuntu/Debian):
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib -y
   ```
3. Pastikan PostgreSQL berjalan:
   ```bash
   sudo systemctl status postgresql
   ```
4. Masuk ke terminal interaktif PostgreSQL:
   ```bash
   sudo -u postgres psql
   ```
5. Jalankan perintah SQL berikut untuk membuat database dan user:
   ```sql
   CREATE DATABASE webmadrasah;
   CREATE USER madrasah_user WITH PASSWORD 'ganti_dengan_password_aman_anda';
   GRANT ALL PRIVILEGES ON DATABASE webmadrasah TO madrasah_user;
   ALTER DATABASE webmadrasah OWNER TO madrasah_user;
   \q
   ```

---

## Langkah 2: Ekspor Data dari Supabase

Kita akan mengekspor skema `public` beserta seluruh isinya dari Supabase. Anda dapat menjalankan perintah ini dari terminal komputer lokal Anda (jika memiliki akses ke Supabase) atau langsung dari terminal VPS Anda:

1. Dapatkan **Direct Connection String** dari Supabase Dashboard proyek Anda (**Settings** → **Database** → **Connection String** → **Direct Connection**).
   Formatnya seperti ini:
   `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`

2. Ekspor data hanya untuk skema `public` menggunakan utilitas `pg_dump`:
   ```bash
   pg_dump --schema=public --no-owner --no-acl --clean -d "postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres" > supabase_backup.sql
   ```
   *Catatan: Ganti `[PROJECT_REF]` dan `[PASSWORD]` sesuai dengan kredensial Supabase Anda.*

---

## Langkah 3: Impor Data ke PostgreSQL Lokal di Server

Setelah mendapatkan berkas `supabase_backup.sql`, kita akan memasukkannya ke database lokal baru di server.

1. Unggah berkas `supabase_backup.sql` ke server VPS Anda (misal ke direktori `/www/wwwroot/webmadrasah/`).
2. Jalankan perintah restorasi menggunakan `psql`:
   ```bash
   psql -d "postgresql://madrasah_user:ganti_dengan_password_aman_anda@localhost:5432/webmadrasah" -f supabase_backup.sql
   ```
3. Jika berhasil, seluruh tabel dan data lama dari Supabase Anda kini telah berada di database server lokal.

---

## Langkah 4: Perbarui Konfigurasi Lingkungan (`.env`) Proyek

Masuk ke folder instalasi aplikasi Anda di server (`/www/wwwroot/webmadrasah/`), lalu buka berkas `.env` untuk mengganti koneksi lama Supabase ke PostgreSQL lokal.

Ubah isi bagian database menjadi:
```env
# Database Settings (Local PostgreSQL Server)
DATABASE_URL="postgresql://madrasah_user:ganti_dengan_password_aman_anda@localhost:5432/webmadrasah?schema=public"
DIRECT_URL="postgresql://madrasah_user:ganti_dengan_password_aman_anda@localhost:5432/webmadrasah?schema=public"
```
*Karena ini PostgreSQL lokal tanpa connection pooler (PgBouncer), nilai `DATABASE_URL` dan `DIRECT_URL` dapat disamakan secara langsung.*

---

## Langkah 5: Terapkan Migrasi & Mulai Ulang Aplikasi

Jalankan perintah berikut di terminal server Anda di dalam direktori `/www/wwwroot/webmadrasah` untuk menyegarkan Prisma Client dan me-restart server PM2:

```bash
# Menghasilkan Prisma client yang baru
npx prisma generate

# Memverifikasi status migrasi database
npx prisma migrate status

# Jalankan sisa migrasi baru jika ada
npx prisma migrate deploy

# Restart aplikasi menggunakan PM2 agar memuat konfigurasi .env baru
pm2 restart webmadrasah
```

Aplikasi Anda kini sudah sepenuhnya bermigrasi ke database PostgreSQL lokal server.

---

## Menggunakan Skrip Bantu Pemindahan Otomatis

Kami juga menyediakan skrip bantu `scripts/db-transfer.sh` di dalam folder proyek Anda. Anda dapat menggunakannya untuk mengotomatiskan langkah 2 dan 3 secara interaktif.

Jalankan perintah berikut di terminal:
```bash
bash scripts/db-transfer.sh
```
Skrip ini akan memandu Anda memasukkan URL Supabase, mengunduh data, dan memulihkannya ke database lokal server secara aman.
