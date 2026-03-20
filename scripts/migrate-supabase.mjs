import { Client } from 'pg'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import dotenv from 'dotenv'

// Load .env file
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function migrate() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    console.error('❌ Error: DATABASE_URL tidak ditemukan di environment variables')
    console.error('   Pastikan file .env sudah diisi dengan connection string PostgreSQL')
    process.exit(1)
  }

  console.log('🚀 Memulai migrasi ke Supabase PostgreSQL...\n')
  console.log('📍 Connection:', connectionString.split('@')[1] || 'hidden')

  const client = new Client({
    connectionString,
    // Avoid prepared statement issues
    preparedStatements: false,
    // SSL configuration for Supabase
    ssl: {
      rejectUnauthorized: false
    }
  })

  try {
    console.log('🔌 Menghubungkan ke database...')
    await client.connect()
    console.log('✅ Terhubung!\n')

    // Read SQL file
    const sqlPath = join(__dirname, '..', 'sql', 'full_schema.sql')
    if (!existsSync(sqlPath)) {
      console.error(`❌ Error: File tidak ditemukan: ${sqlPath}`)
      console.error('   Pastikan Anda sudah generate SQL dengan:')
      console.error('   npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script > sql/full_schema.sql')
      process.exit(1)
    }

    const sql = readFileSync(sqlPath, 'utf-8')

    // Split SQL into individual statements
    let rawStatements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`📊 Total statements: ${rawStatements.length}`)
    if (rawStatements.length === 0) {
      console.log('⚠️  Warning: No statements found. Checking SQL format...')
      console.log('   First 500 chars of SQL:')
      console.log('   ' + sql.substring(0, 500).replace(/\n/g, '\n   '))
      // Try alternative split
      rawStatements = sql.split(/;\s*\n/).filter(s => s.trim().length > 0)
      console.log(`   After alternative split: ${rawStatements.length} statements`)
    }
    console.log('🔨 Menjalankan migrasi...\n')

    let successCount = 0
    let skipCount = 0
    let errorCount = 0

    for (let i = 0; i < rawStatements.length; i++) {
      const stmt = rawStatements[i] + ';'
      try {
        await client.query(stmt)
        successCount++

        // Progress indicator
        if ((i + 1) % 10 === 0 || i === rawStatements.length - 1) {
          console.log(`   ✓ ${i + 1}/${rawStatements.length} (${Math.round((i + 1) / rawStatements.length * 100)}%)`)
        }
      } catch (error) {
        // Skip if object already exists
        if (error.code === '42P07' || // duplicate_table
            error.code === '42710' || // duplicate_object
            error.code === '23505') { // unique_violation (index already exists)
          skipCount++
          console.log(`   ⚠️  Skipped: ${error.message.split('\n')[0].substring(0, 60)}...`)
        } else {
          errorCount++
          console.error(`\n❌ Error pada statement ${i + 1}:`)
          console.error(`   ${stmt.substring(0, 100)}...`)
          console.error(`   Code: ${error.code}`)
          console.error(`   Message: ${error.message}`)

          // Ask if should continue
          if (errorCount >= 5) {
            console.error('\n⚠️  Terlalu banyak error. Migrasi dihentikan.')
            process.exit(1)
          }
        }
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('📊 Ringkasan Migrasi:')
    console.log(`   ✅ Berhasil:  ${successCount}`)
    console.log(`   ⚠️  Skip:     ${skipCount}`)
    console.log(`   ❌ Error:    ${errorCount}`)
    console.log('='.repeat(60))

    if (errorCount === 0) {
      console.log('\n✅ Migrasi berhasil diselesaikan!\n')
    } else {
      console.log('\n⚠️  Migrasi selesai dengan beberapa error. Periksa di atas.\n')
    }

    // Verify tables
    console.log('🔍 Memverifikasi tabel yang dibuat...')
    const tablesResult = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `)

    console.log(`\n📋 Tabel dalam database (${tablesResult.rows.length}):`)
    tablesResult.rows.forEach(row => console.log(`   └─ ${row.table_name}`))

    // Check expected tables
    const expectedTables = [
      'User', 'Category', 'Post', 'Agenda', 'Download', 'Gallery',
      'Teacher', 'PageContent', 'Achievement', 'Extracurricular',
      'Facility', 'Inquiry', 'Announcement', 'Alumni', 'AppSetting',
      'FeaturedProgram', 'Video', 'Competition', 'CompetitionSubmission',
      'RateLimit', 'AuditLog'
    ]

    const createdTables = tablesResult.rows.map(r => r.table_name)
    const missing = expectedTables.filter(t => !createdTables.includes(t))

    if (missing.length === 0) {
      console.log('\n✅ Semua tabel berhasil dibuat!')
    } else {
      console.log(`\n⚠️  Tabel yang belum dibuat: ${missing.join(', ')}`)
    }

    console.log('\n🎉 Setup database selesai!')
    console.log('\n📝 Langkah selanjutnya:')
    console.log('   1. Jalankan: npx prisma generate')
    console.log('   2. Setup admin user: npm run setup:prod')
    console.log('   3. Start aplikasi: npm run dev')
    console.log('')

  } catch (error) {
    console.error('\n❌ Migrasi gagal:')
    console.error(error.message)
    if (error.code) console.error(`   Code: ${error.code}`)
    if (error.hint) console.error(`   Hint: ${error.hint}`)
    process.exit(1)
  } finally {
    await client.end()
    console.log('🔌 Koneksi database ditutup')
  }
}

// Run migration
migrate().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
