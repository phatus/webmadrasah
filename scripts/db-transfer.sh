#!/bin/bash

# ==============================================================================
# SKRIP TRANSFER DATABASE: SUPABASE CLOUD -> POSTGRESQL LOKAL
# ==============================================================================
# Skrip ini mengekspor skema 'public' dari database Supabase dan memulihkannya
# (restore) ke server database PostgreSQL lokal Anda.

# Tampilkan warna teks jika didukung terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================================${NC}"
echo -e "${BLUE}        SKRIP MIGRASI DATA: SUPABASE CLOUD -> POSTGRESQL LOKAL        ${NC}"
echo -e "${BLUE}======================================================================${NC}"
echo ""

# 1. Pengecekan Kebutuhan Utilitas CLI
echo -e "${BLUE}[1/4] Memeriksa instalasi utilitas database...${NC}"

if ! command -v pg_dump &> /dev/null; then
    echo -e "${RED}❌ Kesalahan: 'pg_dump' tidak ditemukan.${NC}"
    echo -e "Silakan instal PostgreSQL client di sistem Anda terlebih dahulu."
    echo -e "Untuk Ubuntu/Debian: ${YELLOW}sudo apt-get install postgresql-client${NC}"
    exit 1
fi

if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ Kesalahan: 'psql' tidak ditemukan.${NC}"
    echo -e "Silakan instal PostgreSQL client di sistem Anda terlebih dahulu."
    echo -e "Untuk Ubuntu/Debian: ${YELLOW}sudo apt-get install postgresql-client${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Utilitas pg_dump dan psql siap digunakan.${NC}"
echo ""

# 2. Memuat Konfigurasi Awal dari .env (jika ada)
echo -e "${BLUE}[2/4] Mencari berkas konfigurasi .env...${NC}"
ENV_FILE=".env"
DEFAULT_SOURCE=""
DEFAULT_TARGET=""

if [ -f "$ENV_FILE" ]; then
    echo -e "Menemukan berkas ${GREEN}.env${NC}. Membaca konfigurasi..."
    
    # Ekstrak DATABASE_URL dan DIRECT_URL
    # Filter komentar, hapus spasi/kutipan
    DB_URL_VAL=$(grep -E "^DATABASE_URL=" "$ENV_FILE" | cut -d'=' -f2- | tr -d '"' | tr -d "'")
    DIR_URL_VAL=$(grep -E "^DIRECT_URL=" "$ENV_FILE" | cut -d'=' -f2- | tr -d '"' | tr -d "'")
    
    # Cek apakah string mengandung supabase
    if [[ "$DB_URL_VAL" == *"supabase"* ]]; then
        DEFAULT_SOURCE="$DB_URL_VAL"
    elif [[ "$DIR_URL_VAL" == *"supabase"* ]]; then
        DEFAULT_SOURCE="$DIR_URL_VAL"
    fi
    
    # Cek koneksi lokal
    if [[ "$DB_URL_VAL" == *"localhost"* || "$DB_URL_VAL" == *"127.0.0.1"* ]]; then
        DEFAULT_TARGET="$DB_URL_VAL"
    fi
else
    echo -e "${YELLOW}⚠️ Berkas .env tidak ditemukan di direktori saat ini.${NC}"
fi

echo ""
# 3. Konfirmasi Parameter Koneksi
echo -e "${BLUE}[3/4] Konfigurasi Parameter Koneksi Database${NC}"
echo -e "--------------------------------------------------------"

# Input URL Sumber (Supabase)
if [ -n "$DEFAULT_SOURCE" ]; then
    echo -e "Supabase URL terdeteksi dari .env: ${YELLOW}${DEFAULT_SOURCE:0:30}...${NC}"
    read -p "Gunakan URL Supabase ini? (Y/n): " confirm_source
    if [[ "$confirm_source" =~ ^[Nn]$ ]]; then
        read -p "Masukkan URL Direct Connection Supabase: " SOURCE_URL
    else
        SOURCE_URL="$DEFAULT_SOURCE"
    fi
else
    read -p "Masukkan URL Direct Connection Supabase: " SOURCE_URL
fi

if [ -z "$SOURCE_URL" ]; then
    echo -e "${RED}❌ URL Supabase tidak boleh kosong!${NC}"
    exit 1
fi

echo ""

# Input URL Tujuan (PostgreSQL Lokal)
if [ -n "$DEFAULT_TARGET" ]; then
    echo -e "PostgreSQL Lokal terdeteksi dari .env: ${YELLOW}${DEFAULT_TARGET:0:30}...${NC}"
    read -p "Gunakan URL Lokal ini? (Y/n): " confirm_target
    if [[ "$confirm_target" =~ ^[Nn]$ ]]; then
        read -p "Masukkan URL Koneksi PostgreSQL Lokal: " TARGET_URL
    else
        TARGET_URL="$DEFAULT_TARGET"
    fi
else
    read -p "Masukkan URL Koneksi PostgreSQL Lokal (contoh: postgresql://user:password@localhost:5432/webmadrasah): " TARGET_URL
fi

if [ -z "$TARGET_URL" ]; then
    echo -e "${RED}❌ URL PostgreSQL Lokal tidak boleh kosong!${NC}"
    exit 1
fi

echo ""

# Konfirmasi Sebelum Menjalankan
echo -e "${YELLOW}PERINGATAN: Proses ini akan mengekspor skema public Supabase dan mengimpornya ke database lokal.${NC}"
echo -e "Koneksi Lokal: ${BLUE}$TARGET_URL${NC}"
read -p "Apakah Anda yakin ingin memulai pemindahan? (y/N): " start_migration
if [[ ! "$start_migration" =~ ^[Yy]$ ]]; then
    echo "Operasi dibatalkan oleh pengguna."
    exit 0
fi

echo ""

# 4. Proses Ekspor dan Impor
echo -e "${BLUE}[4/4] Memulai Proses Transfer Data...${NC}"
TEMP_BACKUP="supabase_backup_temp.sql"

# Ekspor dari Supabase
echo -e "⏳ Mengekspor skema 'public' dari Supabase Cloud ke berkas cadangan sementara..."
if pg_dump --schema=public --no-owner --no-acl --clean -d "$SOURCE_URL" > "$TEMP_BACKUP" 2>/dev/null; then
    echo -e "${GREEN}✓ Ekspor data dari Supabase berhasil.${NC}"
else
    # Coba sekali lagi dan tampilkan error detail jika gagal
    echo -e "${YELLOW}Mencoba kembali ekspor data dengan output detail kesalahan...${NC}"
    if ! pg_dump --schema=public --no-owner --no-acl --clean -d "$SOURCE_URL" > "$TEMP_BACKUP"; then
        echo -e "${RED}❌ Gagal mengekspor data dari Supabase. Periksa koneksi dan kredensial Anda.${NC}"
        rm -f "$TEMP_BACKUP"
        exit 1
    fi
fi

echo ""

# Impor ke Lokal
echo -e "⏳ Mengimpor data ke PostgreSQL lokal di server..."
if psql -d "$TARGET_URL" -f "$TEMP_BACKUP" > /dev/null; then
    echo -e "${GREEN}✓ Impor data ke PostgreSQL lokal berhasil.${NC}"
else
    echo -e "${YELLOW}Mencoba kembali impor data dengan output detail kesalahan...${NC}"
    if ! psql -d "$TARGET_URL" -f "$TEMP_BACKUP"; then
        echo -e "${RED}❌ Gagal mengimpor data ke PostgreSQL lokal. Pastikan database lokal berjalan dan kredensial benar.${NC}"
        rm -f "$TEMP_BACKUP"
        exit 1
    fi
fi

# Pembersihan Berkas Sementara
rm -f "$TEMP_BACKUP"

echo ""
echo -e "${BLUE}======================================================================${NC}"
echo -e "${GREEN}🎉 PROSES MIGRASI DATA SELESAI DENGAN SUKSES!                        ${NC}"
echo -e "${BLUE}======================================================================${NC}"
echo -e "Silakan lakukan hal berikut:"
echo -e "1. Pastikan berkas ${YELLOW}.env${NC} produksi Anda menggunakan URL PostgreSQL Lokal."
echo -e "2. Jalankan ${YELLOW}npx prisma generate${NC} di direktori proyek."
echo -e "3. Jalankan ${YELLOW}npx prisma migrate status${NC} untuk memastikan database sinkron."
echo -e "4. Restart aplikasi Next.js Anda (misal: ${YELLOW}pm2 restart webmadrasah${NC})."
echo -e "${BLUE}======================================================================${NC}"
