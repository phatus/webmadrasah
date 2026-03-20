import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
})

async function check() {
  try {
    await prisma.$connect()
    console.log('✅ Connected to database\n')

    // Check tables count
    const tables = await prisma.$queryRaw`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `
    console.log(`📊 Total tables: ${tables.length}`)

    // Check users
    const userCount = await prisma.user.count()
    console.log(`👤 Total users: ${userCount}`)

    const admin = await prisma.user.findFirst({
      where: { username: 'admin' }
    })
    if (admin) {
      console.log(`🔐 Admin user found:`)
      console.log(`   - ID: ${admin.id}`)
      console.log(`   - Name: ${admin.name}`)
      console.log(`   - Role: ${admin.role}`)
    } else {
      console.log(`⚠️  Admin user NOT found. Need to run setup.`)
    }

    // Check categories
    const catCount = await prisma.category.count()
    console.log(`📁 Categories: ${catCount}`)

    // Check settings
    const settingsCount = await prisma.appSetting.count()
    console.log(`⚙️  App settings: ${settingsCount}`)

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

check()
