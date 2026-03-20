import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
})

async function test() {
  try {
    console.log('🔌 Connecting to database...')
    await prisma.$connect()
    console.log('✅ Connected!')

    console.log('📊 Testing simple query...')
    const result = await prisma.$queryRaw`SELECT version()`
    console.log('✅ Query successful:', result)

    console.log('🔍 Checking existing tables...')
    try {
      const tables = await prisma.$queryRaw`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `
      console.log('📋 Tables in database:', tables.map(t => t.table_name))
    } catch (e) {
      console.log('⚠️  Could not list tables:', e.message)
    }

  } catch (error) {
    console.error('❌ Error:')
    console.error(error)
  } finally {
    await prisma.$disconnect()
    console.log('🔌 Disconnected')
  }
}

test()
