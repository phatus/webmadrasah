import { Client } from 'pg'
import { readFileSync } from 'fs'
import { join } from 'path'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error('❌ DATABASE_URL tidak ditemukan di environment variables')
  process.exit(1)
}

console.log('🔌 Menghubungkan ke Supabase PostgreSQL...')

const client = new Client({ connectionString })

async function runMigration() {
  try {
    await client.connect()
    console.log('✅ Terhubung ke database')

    // Read SQL file
    const sqlPath = join(process.cwd(), 'sql', 'full_schema.sql')
    const sql = readFileSync(sqlPath, 'utf-8')

    console.log('📜 Memproses SQL migration...')
    console.log('   (Total statements to execute)')

    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`   📊 ${statements.length} statements akan dieksekusi`)

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i] + ';'
      try {
        await client.query(stmt)
        if ((i + 1) % 5 === 0) {
          console.log(`   ✓ ${i + 1}/${statements.length} statements completed`)
        }
      } catch (error) {
        // Skip if already exists (duplicate objects)
        if (error.code === '42P07' || error.code === '42710') {
          console.log(`   ⚠️  Statement ${i + 1} skipped (already exists)`)
        } else {
          throw error
        }
      }
    }

    console.log('\n✅ Migration completed successfully!')

    // Verify tables
    console.log('\n🔍 Verifying tables...')
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `)

    console.log(`\n📋 Tables created (${tables.rows.length}):`)
    tables.rows.forEach(row => console.log(`   - ${row.table_name}`))

  } catch (error) {
    console.error('\n❌ Migration failed:')
    console.error(error.message)
    if (error.detail) console.error('Detail:', error.detail)
    if (error.hint) console.error('Hint:', error.hint)
    process.exit(1)
  } finally {
    await client.end()
    console.log('\n🔌 Database connection closed')
  }
}

runMigration()
