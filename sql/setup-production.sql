-- ============================================
-- PRODUCTION SETUP FOR WEBMADRASAH
-- ============================================
-- Jalankan SQL ini di Supabase Dashboard setelah migration selesai
--
-- Berisi:
-- 1. Admin user (username: admin, password: WebMadrasah@2024)
-- 2. Default categories
-- 3. Default app settings
-- ============================================

-- 1. CREATE ADMIN USER
-- Password: WebMadrasah@2024 (bcrypt hash, 12 rounds)
INSERT INTO "User" (name, username, password, role, "createdAt", "updatedAt")
VALUES (
  'Administrator',
  'admin',
  '$2b$12$JxaMpjJN/BFtCvEzOiucGO2NUaCG8ZgXD4L.1KAdgDg1E1L/YZtcC',
  'ADMIN',
  NOW(),
  NOW()
)
ON CONFLICT (username) DO NOTHING;

-- 2. CREATE DEFAULT CATEGORIES
INSERT INTO "Category" (name, slug, "createdAt", "updatedAt")
VALUES
  ('Berita', 'berita', NOW(), NOW()),
  ('Pengumuman', 'pengumuman', NOW(), NOW()),
  ('Kegiatan', 'kegiatan', NOW(), NOW()),
  ('Prestasi', 'prestasi', NOW(), NOW()),
  ('Informasi', 'informasi', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- 3. CREATE DEFAULT APP SETTINGS
INSERT INTO "AppSetting" (key, value, "updatedAt")
VALUES
  ('site_name', 'MTsN 1 Pacitan', NOW()),
  ('site_description', 'Website Resmi MTsN 1 Pacitan - Madrasah Hebat Bermartabat', NOW()),
  ('site_logo', '', NOW()),
  ('contact_email', 'info@mtsn1pacitan.sch.id', NOW()),
  ('contact_phone', '', NOW()),
  ('contact_address', '', NOW()),
  ('social_facebook', '', NOW()),
  ('social_instagram', '', NOW()),
  ('social_youtube', '', NOW()),
  ('headmaster_name', '', NOW()),
  ('map_embed', '', NOW())
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  "updatedAt" = EXCLUDED."updatedAt";

-- ============================================
-- VERIFICATION QUERIES (Run after setup)
-- ============================================
-- Check admin user:
-- SELECT id, name, username, role FROM "User" WHERE username = 'admin';
--
-- Check categories:
-- SELECT * FROM "Category" ORDER BY id;
--
-- Check settings:
-- SELECT * FROM "AppSetting";
