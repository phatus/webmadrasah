# Panduan Deploy ke aaPanel (Next.js)

Panduan ini berisi langkah-langkah untuk mendeploy aplikasi Next.js Web Madrasah ke aaPanel menggunakan Node.js Manager.

## Prasyarat
1.  **aaPanel** terinstal di server.
2.  **Node.js Manager** (versi 2.0 atau terbaru) terinstal di aaPanel (install via App Store).
3.  **Git** terinstal di server (biasanya sudah ada).

## Langkah 1: Persiapan di aaPanel

1.  Login ke aaPanel.
2.  Buka **Files** dan masuk ke direktori `/www/wwwroot/`.
3.  Buka Terminal (bisa via SSH atau terminal bawaan aaPanel).

## Langkah 2: Clone Repository

Jalankan perintah berikut di terminal server:

```bash
cd /www/wwwroot/
git clone https://github.com/phatus/webmadrasah.git
cd webmadrasah
```

## Langkah 2.5: Konfigurasi .env (PENTING)

Buat file `.env` di dalam folder `webmadrasah`:
1.  Buka File Manager aaPanel.
2.  Masuk ke `/www/wwwroot/webmadrasah`.
3.  Buat file baru bernama `.env`.
4.  Isi dengan konten berikut:

```env
# Gunakan path relatif untuk SQLite di server
DATABASE_URL="file:./dev.db" 

# Copy dari .env lokal Anda atau buat secret baru
AUTH_SECRET="secret_random_yang_panjang" 

# Cloudinary (biarkan sama jika pakai akun yang sama)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dgx0p6axm"
```

## Langkah 3: Install & Build

Masih di terminal dalam folder `webmadrasah`, jalankan:

```bash
# Install dependencies
npm install

# Generate Prisma Client (PENTING: Agar mengenali database baru)
npx prisma generate

# Build aplikasi untuk production
npm run build
```

> **Catatan**: Jika build gagal karena memory, pastikan server memiliki RAM cukup atau aktifkan SWAP.

## Langkah 4: Setup Node Project

1.  Buka menu **Website** -> **Node Project** di aaPanel.
2.  Klik **Add Node Project**.
3.  Isi konfigurasi:
    *   **Project Path**: Pilih folder `/www/wwwroot/webmadrasah`.
    *   **Name**: `webmadrasah` (otomatis terisi).
    *   **Run User**: `www`.
    *   **Start Command**: `npm start` (atau script `start` di package.json).
    *   **Port**: `3000`.
    *   **Node Version**: Pilih versi v18 atau yang lebih baru.
4.  Klik **Submit**.

> **Info**: Kami telah mengaktifkan `output: 'standalone'` di konfigurasi Next.js. Namun, untuk kemudahan di aaPanel, menggunakan `npm start` (yang menjalankan `next start`) adalah cara paling aman.

> **PENTING TENTANG DATABASE**:
> Karena kita menggunakan SQLite (`dev.db`) yang ikut di-upload ke GitHub:
> - Saat pertama deploy: Database akan otomatis terisi data (Video, Agenda, dll) dari laptop Anda.
> - **PERINGATAN**: Jika Anda melakukan perubahan data di server (menambah berita/agenda), lalu Anda melakukan `git pull` dari laptop, **DATA DI SERVER BISA TERTIMPA** oleh data laptop.
> - **Solusi**: Jangan pernah commit `dev.db` lagi jika website sudah live. Masukkan `prisma/dev.db` ke `.gitignore` setelah deploy pertama.

## Langkah 5: Domain & SSL (Mapping)

1.  Di daftar Node Project, klik **Domain** (atau Mapping).
2.  Masukkan domain Anda (contoh: `sekolah.sch.id`).
3.  Setelah domain aktif, masuk ke tab **SSL**.
4.  Pilih **Let's Encrypt**, centang domain, dan klik **Apply**.
5.  Aktifkan "Force HTTPS" jika perlu.

## Cara Update Aplikasi

Jika Anda melakukan perubahan code dan push ke GitHub, lakukan ini di server untuk update:

1.  Buka Terminal dan masuk ke folder:
    ```bash
    cd /www/wwwroot/webmadrasah
    ```
2.  Tarik update terbaru:
    ```bash
    git pull
    ```
3.  Build ulang:
    ```bash
    npm install
    npm run build
    ```
4.  **Restart** project di menu Node Project aaPanel untuk menerapkan perubahan.
